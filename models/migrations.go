package models

import (
	"context"

	"github.com/jackc/pgx/v4/stdlib"
	"github.com/jackc/tern/migrate"
	"github.com/jmoiron/sqlx"
)

var migrations = []*migrate.Migration{
	{
		Sequence: 1,
		Name:     "create leaderboard_scores table",
		UpSQL: `CREATE TABLE leaderboard_scores (
	id serial PRIMARY KEY,
	created timestamp with time zone NOT NULL,
	modified timestamp with time zone NOT NULL,
	game_banner character varying(100) NOT NULL,
	game_name character varying(255) NOT NULL,
	player_name character varying(255) NOT NULL,
	player_score bigint NOT NULL
);`,
		DownSQL: "DROP TABLE leaderboard_scores;",
	},
	{
		Sequence: 2,
		Name:     "create users table",
		UpSQL: `CREATE TABLE users (
	id serial PRIMARY KEY,
	username character varying(255) UNIQUE NOT NULL,
	password character varying(255) NOT NULL,
	approved boolean NOT NULL DEFAULT false
);`,
		DownSQL: "DROP TABLE users;",
	},
	{
		Sequence: 3,
		Name:     "create sessions table",
		UpSQL: `CREATE TABLE sessions (
	id serial PRIMARY KEY,
	user_id integer NOT NULL REFERENCES users(id),
	token character varying(255) UNIQUE NOT NULL,
	created timestamp with time zone NOT NULL,
	expires timestamp with time zone NOT NULL
);`,
		DownSQL: "DROP TABLE sessions;",
	},
}

func Migrate(ctx context.Context, sqlxDB *sqlx.DB) error {
	db, err := stdlib.AcquireConn(sqlxDB.DB)
	if err != nil {
		return err
	}
	defer stdlib.ReleaseConn(sqlxDB.DB, db)

	m, err := migrate.NewMigrator(ctx, db, "tern_migrations")
	if err != nil {
		return err
	}

	m.Migrations = migrations

	err = m.Migrate(ctx)
	if err != nil {
		return err
	}

	return nil
}
