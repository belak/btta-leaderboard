package models

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"time"

	"github.com/jmoiron/sqlx"
)

func generateSecureToken(length int) (string, error) {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

type Session struct {
	ID      int64
	UserID  int64 `db:"user_id"`
	Token   string
	Created time.Time
	Expires time.Time
}

// TODO: clean up stale sessions

func LookupSession(ctx context.Context, tx *sqlx.Tx, sessionID string) (*Session, error) {
	var session Session

	const query = `SELECT sessions.* FROM sessions
INNER JOIN users ON users.id = sessions.user_id
WHERE sessions.token = $1;`
	err := tx.GetContext(ctx, &session, query, sessionID)
	if err != nil {
		return nil, err
	}

	return &session, err
}

func CreateSession(ctx context.Context, tx *sqlx.Tx, user *User) (*Session, error) {
	now := time.Now()

	token, err := generateSecureToken(32)
	if err != nil {
		return nil, err
	}

	session := &Session{
		UserID:  user.ID,
		Token:   token,
		Created: now,
		Expires: now.Add(7 * 24 * time.Hour),
	}

	const query = `INSERT INTO sessions (user_id, token, created, expires) VALUES($1, $2, $3, $4) RETURNING id;`
	err = tx.GetContext(ctx, &session.ID, query, session.UserID, session.Token, session.Created, session.Expires)
	if err != nil {
		return nil, err
	}

	return session, nil
}

func (s *Session) Refresh(ctx context.Context, tx *sqlx.Tx) error {
	s.Expires = time.Now().Add(7 * 24 * time.Hour)

	const query = `UPDATE sessions SET expires = $1 WHERE id = $2;`
	_, err := tx.ExecContext(ctx, query, s.Expires, s.ID)
	return err
}
