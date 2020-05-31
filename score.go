package leaderboard

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/belak/simple-leaderboard/models"
	"github.com/belak/simple-leaderboard/web"
	"github.com/go-chi/chi"
)

func (s *Server) scoresList(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	tx := s.NewTx(ctx)
	defer tx.Commit()

	scores, err := models.ListScores(ctx, tx)
	if err != nil {
		web.WriteInternalError(w, err)
		return
	}

	web.WriteJSON(w, scores, http.StatusOK)
}

func (s *Server) scoresGet(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	scoreId, err := strconv.ParseInt(chi.URLParam(r, "scoreID"), 10, 64)
	if err != nil {
		web.WriteError(w, err, http.StatusBadRequest)
		return
	}

	tx := s.NewTx(ctx)
	defer tx.Commit()

	score, err := models.GetScore(ctx, tx, scoreId)
	if err == sql.ErrNoRows {
		web.WriteStatus(w, http.StatusNotFound)
		return
	} else if err != nil {
		web.WriteInternalError(w, err)
		return
	}

	web.WriteJSON(w, score, http.StatusOK)
}

func (s *Server) adminScoresCreate(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var score models.Score
	err := web.ReadJSON(r, &score)
	if err != nil {
		web.WriteError(w, err, http.StatusBadRequest)
		return
	}

	score.ID = 0

	tx := s.NewTx(ctx)
	defer tx.Commit()

	err = models.CreateScore(ctx, tx, &score)
	if err != nil {
		web.WriteInternalError(w, err)
		return
	}

	web.WriteStatus(w, http.StatusNoContent)
}

func (s *Server) adminScoresUpdate(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	scoreID, err := strconv.ParseInt(chi.URLParam(r, "scoreID"), 10, 64)
	if err != nil {
		web.WriteError(w, err, http.StatusBadRequest)
		return
	}

	var score models.Score
	err = web.ReadJSON(r, &score)
	if err != nil {
		web.WriteError(w, err, http.StatusBadRequest)
		return
	}

	score.ID = scoreID

	tx := s.NewTx(ctx)
	defer tx.Commit()

	err = score.Save(ctx, tx)
	if err != nil {
		web.WriteInternalError(w, err)
		return
	}

	web.WriteStatus(w, http.StatusNoContent)
}
