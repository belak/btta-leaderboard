package models

import (
	"context"

	"github.com/jmoiron/sqlx"
)

func LookupUserBySession(ctx context.Context, tx *sqlx.Tx, token string) (*User, *Session, error) {
	session, err := LookupSession(ctx, tx, token)
	if err != nil {
		return nil, nil, err
	}

	user, err := LookupUserByID(ctx, tx, session.UserID)
	if err != nil {
		return nil, nil, err
	}

	return user, session, nil
}
