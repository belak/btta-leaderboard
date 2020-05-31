package main

import leaderboard "github.com/belak/simple-leaderboard"

func main() {
	s := leaderboard.NewServer()
	defer s.Close()
	s.Run()
}
