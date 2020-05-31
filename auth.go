package leaderboard

import (
	"database/sql"
	"net/http"

	"github.com/belak/simple-leaderboard/models"
	"github.com/belak/simple-leaderboard/web"
)

type AuthRegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (s *Server) authRegister(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req AuthRegisterRequest
	err := web.ReadJSON(r, &req)
	if err != nil {
		web.WriteError(w, err, http.StatusBadRequest)
		return
	}

	tx := s.NewTx(ctx)
	defer tx.Commit()

	_, err = models.CreateUser(ctx, tx, req.Username, req.Password)
	if err != nil {
		web.WriteInternalError(w, err)
		return
	}

	web.WriteStatus(w, http.StatusNoContent)
}

type AuthLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthLoginResponse struct {
	Token string `json:"token"`
}

func (s *Server) authLogin(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req AuthLoginRequest
	err := web.ReadJSON(r, &req)
	if err != nil {
		web.WriteError(w, err, http.StatusBadRequest)
		return
	}

	tx := s.NewTx(ctx)
	defer tx.Commit()

	user, err := models.LookupUser(ctx, tx, req.Username)
	if err == sql.ErrNoRows {
		web.WriteString(w, "not authorized", http.StatusUnauthorized)
		return
	} else if err != nil {
		web.WriteInternalError(w, err)
		return
	}

	if !user.CheckPassword(req.Password) {
		web.WriteString(w, "not authorized", http.StatusUnauthorized)
		return
	}

	session, err := models.CreateSession(ctx, tx, user)
	if err != nil {
		web.WriteInternalError(w, err)
		return
	}

	resp := &AuthLoginResponse{
		Token: session.Token,
	}
	web.WriteJSON(w, resp, http.StatusOK)
}

type AuthSetPassword struct {
	Password string `json:"password"`
}

func (s *Server) adminSetPassword(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req AuthSetPassword
	err := web.ReadJSON(r, &req)
	if err != nil {
		web.WriteError(w, err, http.StatusBadRequest)
		return
	}

	user := CtxUser(ctx)
	err = user.SetPassword(req.Password)
	if err != nil {
		web.WriteInternalError(w, err)
		return
	}

	tx := s.NewTx(ctx)
	defer tx.Commit()

	err = user.Save(ctx, tx)
	if err != nil {
		web.WriteInternalError(w, err)
		return
	}

	web.WriteStatus(w, http.StatusNoContent)
}
