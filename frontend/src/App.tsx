import React, { useState, useCallback, useRef } from "react";

import LeaderboardPage from "./LeaderboardPage";
import useAPIState from "./useAPIState";
import ImagePage from "./ImagePage";
import { useWindowSize, isMobile } from "./utils";

type PageType = "form" | "leaderboard" | "images";

function App() {
  const urlInput = useRef<HTMLInputElement>(null);

  const {
    state,
    baseURL,
    setBaseURL,
    refreshImages,
    refreshScores,
  } = useAPIState();

  const [currentPage, setCurrentPage] = useState<PageType>("images");

  const windowSize = useWindowSize();
  const onMobile = isMobile(windowSize);

  const onFinished = useCallback(() => {
    console.log("onFinished", currentPage);
    switch (currentPage) {
      case "form":
        setCurrentPage("leaderboard");
        break;
      case "leaderboard":
        setCurrentPage("images");
        // After switching from the leaderboard, queue up a score refresh
        if (!onMobile) {
          refreshScores();
        }
        break;
      case "images":
        setCurrentPage("leaderboard");
        // After switching from the images, queue up an image refresh
        if (!onMobile) {
          refreshImages();
        }
        break;
      default:
        setCurrentPage("leaderboard");
        break;
    }
  }, [setCurrentPage, currentPage, refreshImages, refreshScores, onMobile]);

  const onSubmit = useCallback(() => {
    if (urlInput.current) {
      setBaseURL(urlInput.current.value);
    }
    setCurrentPage("leaderboard");
  }, [setCurrentPage, urlInput, setBaseURL]);

  const onHeaderClick = useCallback(() => {
    // Wait for the next animation frame and set the value
    setCurrentPage("form");

    window.requestAnimationFrame(() => {
      if (!urlInput.current) {
        throw Error("couldn't get input ref");
      }

      urlInput.current.value = baseURL;
    });
  }, [setCurrentPage, urlInput, baseURL]);

  const onForm = currentPage === "form";
  const onLeaderboard = !onMobile ? currentPage === "leaderboard" : !onForm;
  const onImages = !onMobile ? currentPage === "images" : !onForm;

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

      {onForm && (
        <form onSubmit={onSubmit}>
          URL: <input name="url" ref={urlInput} />
          <button type="submit">Connect</button>
        </form>
      )}

      {onLeaderboard && <LeaderboardPage onFinished={onFinished} />}
      {onImages && <ImagePage onFinished={onFinished} />}

      <footer>
        <img src="pacman-ghosts.jpg" alt="" />
      </footer>
    </div>
  );

  return ret;
}

export default App;
