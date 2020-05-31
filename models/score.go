package models

import (
	"context"
	"time"

	"github.com/jmoiron/sqlx"
)

type Score struct {
	ID          int64     `json:"id" db:"id"`
	Created     time.Time `json:"created" db:"created"`
	Modified    time.Time `json:"modified" db:"modified"`
	GameBanner  string    `json:"game_banner" db:"game_banner"`
	GameName    string    `json:"game_name" db:"game_name"`
	PlayerName  string    `json:"player_name" db:"player_name"`
	PlayerScore int64     `json:"player_score" db:"player_score"`

	// Any calculated parameters - stuff that doesn't come from the DB, but
	// needs to be output via the API.
	GameBannerThumbnail string `json:"game_banner_thumbnail" db:"-"`
}

func CreateScore(ctx context.Context, tx *sqlx.Tx, score *Score) error {
	now := time.Now()

	score.Created = now
	score.Modified = now

	// Run an INSERT
	const query = `INSERT INTO leaderboard_scores (created, modified, game_banner, game_name, player_name, player_score)
VALUES($1, $2, $3, $4, $5, $6);`

	res, err := tx.ExecContext(
		ctx,
		query,
		score.Created,
		score.Modified,
		score.GameBanner,
		score.GameName,
		score.PlayerName,
		score.PlayerScore)
	if err != nil {
		return err
	}

	// Update the object with the last inserted ID
	score.ID, err = res.LastInsertId()

	return err
}

func ListScores(ctx context.Context, tx *sqlx.Tx) ([]Score, error) {
	// NOTE: we do it this way so when we render it and there's an empty list,
	// it's actually rendered as a list.
	scores := make([]Score, 0)

	err := tx.SelectContext(ctx, &scores, "SELECT * FROM leaderboard_scores ORDER BY game_name")
	if err != nil {
		return nil, err
	}

	for _, s := range scores {
		s.Populate()
	}

	return scores, nil
}

func GetScore(ctx context.Context, tx *sqlx.Tx, id int64) (*Score, error) {
	var score Score
	err := tx.GetContext(ctx, &score, "SELECT * FROM leaderboard_scores WHERE id = $1 ORDER BY game_name", id)
	if err != nil {
		return nil, err
	}

	score.Populate()

	return &score, nil
}

func (s *Score) Populate() {
	// TODO: generate GameBannerThumbnail
	s.GameBannerThumbnail = s.GameBanner
}

func (s *Score) Save(ctx context.Context, tx *sqlx.Tx) error {
	s.Modified = time.Now()

	// Run an UPDATE
	const query = `UPDATE leaderboard_scores
SET modified = $1,
game_banner = $2,
game_name = $3,
player_name = $4,
player_score = $5
WHERE id = $6;`

	_, err := tx.ExecContext(
		ctx,
		query,
		s.Modified,
		s.GameBanner,
		s.GameName,
		s.PlayerName,
		s.PlayerScore,
		s.ID)

	return err
}
