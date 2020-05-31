package leaderboard

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/httplog"
	"github.com/jmoiron/sqlx"
	"github.com/rs/zerolog"

	"github.com/belak/simple-leaderboard/models"

	_ "github.com/jackc/pgx/v4/stdlib"
)

// Server is a container for any global state needed for the handlers.
type Server struct {
	Log *zerolog.Logger
	DB  *sqlx.DB
}

// NewServer creates a new server from environment variables.
func NewServer() *Server {
	log := zerolog.New(os.Stdout)

	db, err := sqlx.Connect("pgx", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to the DB")
	}

	s := &Server{
		Log: &log,
		DB:  db,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = models.Migrate(ctx, s.DB)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to migrate the DB")
	}
	return s
}

func (s *Server) Close() {
	s.DB.Close()
}

func (s *Server) NewTx(ctx context.Context) *sqlx.Tx {
	return s.DB.MustBeginTx(ctx, nil)
}

func (s *Server) Run() {
	r := chi.NewMux()

	r.Use(
		httplog.RequestLogger(*s.Log),
		middleware.Recoverer,
		cors.Handler(cors.Options{
			AllowedOrigins: []string{"*"},
			AllowedHeaders: []string{"Authorization"},
			AllowedMethods: []string{"HEAD", "GET", "POST", "UPDATE"},
			MaxAge:         12 * 3600,
		}),
	)

	r.Route("/api", func(r chi.Router) {
		r.Use(s.withAPIAuth)

		r.Get("/scores", s.scoresList)
		r.Get("/scores/{scoreID}", s.scoresGet)

		r.Route("/auth", func(r chi.Router) {
			r.Use(s.ensureNoUser)

			r.Post("/register", s.authRegister)
			r.Post("/login", s.authLogin)
		})

		r.Route("/admin", func(r chi.Router) {
			r.Use(s.ensureUser)

			r.Post("/set_password", s.adminSetPassword)

			r.Get("/scores", s.scoresList)
			r.Get("/scores/{scoreID}", s.scoresGet)
			r.Post("/scores", s.adminScoresCreate)
			r.Put("/scores/{scoreID}", s.adminScoresUpdate)
		})
	})

	err := http.ListenAndServe(":8000", r)
	if err != nil {
		s.Log.Fatal().Err(err).Msg("failed to run server")
	}
}
