package leaderboard

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/belak/simple-leaderboard/models"
	"github.com/belak/simple-leaderboard/web"
)

func (s *Server) withAPIAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader != "" {
			split := strings.SplitN(authHeader, " ", 2)

			if len(split) != 2 || split[0] != "Token" {
				web.WriteString(w, "invalid auth token", http.StatusBadRequest)
				return
			}

			ctx := r.Context()
			tx := s.NewTx(ctx)
			defer tx.Commit()

			user, session, err := models.LookupUserBySession(ctx, tx, split[1])
			if err == sql.ErrNoRows {
				web.WriteString(w, "not authorized", http.StatusUnauthorized)
				return
			} else if err != nil {
				web.WriteInternalError(w, err)
				return
			}

			// Try to refresh the session, but if it fails, it's not a huge deal
			// - we'd rather the user can continue their request.
			err = session.Refresh(ctx, tx)
			if err != nil {
				s.Log.Warn().Err(err).Msg("failed to refresh session")
			}

			next.ServeHTTP(w, r.WithContext(WithUser(ctx, user)))
		} else {
			next.ServeHTTP(w, r)
		}
	})

}

func (s *Server) ensureUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := CtxUser(r.Context())
		if user == nil {
			_ = web.WriteString(w, "forbidden", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (s *Server) ensureNoUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := CtxUser(r.Context())
		if user != nil {
			_ = web.WriteString(w, "forbidden", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}
