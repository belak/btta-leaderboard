package leaderboard

import (
	"context"

	"github.com/belak/simple-leaderboard/models"
)

// contextKey is a value for use with context.WithValue. It's used as a pointer
// so it fits in an interface{} without allocation. This technique for defining
// context keys was copied from Go 1.7's new use of context in net/http.
type contextKey struct {
	name string
}

func (k *contextKey) String() string {
	return "context key: " + k.name
}

var userContextKey = &contextKey{"user"}

func WithUser(ctx context.Context, user *models.User) context.Context {
	return context.WithValue(ctx, userContextKey, user)
}

func CtxUser(ctx context.Context) *models.User {
	user, ok := ctx.Value(userContextKey).(*models.User)
	if !ok {
		return nil
	}
	return user
}
