package models

import (
	"context"
	"errors"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       int64
	Username string
	Password []byte
	Approved bool
}

func (u *User) SetPassword(pass string) error {
	data, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = data
	return nil
}

func CreateUser(ctx context.Context, tx *sqlx.Tx, username, password string) (*User, error) {
	u := &User{
		Username: username,
	}

	err := u.SetPassword(password)
	if err != nil {
		return nil, err
	}

	const query = `INSERT INTO users (username, password) VALUES($1, $2) RETURNING id;`
	err = tx.GetContext(ctx, &u.ID, query, u.Username, u.Password)
	if err != nil {
		return nil, err
	}

	return u, err
}

func LookupUserByID(ctx context.Context, tx *sqlx.Tx, id int64) (*User, error) {
	var u User

	const query = `SELECT * FROM users WHERE id = $1 AND approved = true;`
	err := tx.GetContext(ctx, &u, query, id)
	if err != nil {
		return nil, err
	}

	return &u, err
}

func LookupUser(ctx context.Context, tx *sqlx.Tx, username string) (*User, error) {
	var u User

	const query = `SELECT * FROM users WHERE username = $1;`
	err := tx.GetContext(ctx, &u, query, username)
	if err != nil {
		return nil, err
	}

	if !u.Approved {
		return nil, errors.New("user is not active")
	}

	return &u, err
}

func (u *User) CheckPassword(pass string) bool {
	return bcrypt.CompareHashAndPassword(u.Password, []byte(pass)) == nil
}

func (u *User) Save(ctx context.Context, tx *sqlx.Tx) error {
	const query = `UPDATE users SET password = $1, approved = $2 WHERE username = $3;`
	_, err := tx.ExecContext(ctx, query, u.Password, u.Approved, u.Username)
	return err
}
