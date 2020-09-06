import React, { useState, useCallback, useRef } from "react";

import Leaderboard from "./LeaderboardPage";
import useAPIState from "./useAPIState";

type FormData = {
  url: string;
};

function App() {
  const urlInput = useRef<HTMLInputElement>(null);

  const { state, baseURL, setBaseURL } = useAPIState();

  // If an error occured, we don't count as connected.
  const [showForm, setShowForm] = useState(false);

  const onSubmit = useCallback(() => {
    if (urlInput.current) {
      setBaseURL(urlInput.current.value);
    }
    setShowForm(false);
  }, [setShowForm, urlInput, setBaseURL]);

  const onHeaderClick = useCallback(() => {
    // Wait for the next animation frame and set the value
    setShowForm(true);

    window.requestAnimationFrame(() => {
      if (!urlInput.current) {
        throw Error("couldn't get input ref");
      }

      urlInput.current.value = baseURL;
    });
  }, [setShowForm, urlInput, baseURL]);

  const ret = (
    <div className="App">
      <header onClick={onHeaderClick}>
        <img className="logo" src="logo.png" alt="Back to the Arcade" />
        <img
          className="leaderboard"
          src="leaderboard-text.png"
          alt="Leaderboard"
        />
      </header>

      {state.error && (
        <div>
          <h2>Error:</h2>
          {state.error}
        </div>
      )}

      {!showForm ? (
        <Leaderboard />
      ) : (
        <form onSubmit={onSubmit}>
          URL: <input name="url" ref={urlInput} />
          <button type="submit">Connect</button>
        </form>
      )}

      <footer>
        <img src="pacman-ghosts.jpg" alt="" />
      </footer>
    </div>
  );

  return ret;
}

export default App;
