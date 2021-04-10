import { useState, useCallback, useRef, useEffect } from "react";

import Mousetrap from "mousetrap";
import { FaPause } from "react-icons/fa";

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

  const [paused, setPaused] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>("images");
  const [imageCounter, setImageCounter] = useState(0);

  const windowSize = useWindowSize();
  const onMobile = isMobile(windowSize);

  const togglePaused = useCallback(() => {
    setPaused(!paused);
  }, [paused, setPaused]);

  useEffect(() => {
    // We want to make sure "p" isn't bound when in the form so it doesn't
    // conflict with text input.
    if (currentPage === "form") {
      return;
    }

    Mousetrap.bind("p", togglePaused);

    return () => {
      Mousetrap.unbind("p");
    };
  }, [togglePaused, currentPage]);

  const onNextPage = useCallback(() => {
    // console.log("onNextPage", currentPage);

    // For the most part, we ignore onNextPage, other than for images where we
    // jump to the leaderboard.
    switch (currentPage) {
      case "images":
        // After switching from the images, jump to the next image
        setCurrentPage("leaderboard");
        setImageCounter(imageCounter + 1);
        break;
      default:
        break;
    }
  }, [setCurrentPage, currentPage, imageCounter, setImageCounter]);

  const onFinished = useCallback(() => {
    // console.log("onFinished", currentPage);

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
        // After switching from the images, jump to the next image and queue
        // up an image refresh
        setCurrentPage("leaderboard");
        setImageCounter(0);
        if (!onMobile) {
          refreshImages();
        }
        break;
      default:
        setCurrentPage("leaderboard");
        break;
    }
  }, [
    setCurrentPage,
    currentPage,
    refreshImages,
    refreshScores,
    setImageCounter,
    onMobile,
  ]);

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

  const scoresLoaded = state.scores.length;
  const imagesLoaded = state.images.length;

  // This black magic is to avoid an error on startup where it will spin between
  // pages while loading.
  useEffect(() => {
    // If they're both loaded or unloaded, we can't do anything, so bail early.
    if (scoresLoaded === imagesLoaded) {
      return;
    }

    if (currentPage === "leaderboard" && !scoresLoaded) {
      setCurrentPage("images");
    } else if (currentPage === "images" && !imagesLoaded) {
      setCurrentPage("leaderboard");
    }
  }, [scoresLoaded, imagesLoaded, setCurrentPage, currentPage]);

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

      {scoresLoaded && onLeaderboard && (
        <LeaderboardPage
          onFinished={onFinished}
          onNextPage={onNextPage}
          paused={paused}
        />
      )}
      {imagesLoaded && onImages && (
        <ImagePage
          onFinished={onFinished}
          onNextPage={onNextPage}
          paused={paused}
          page={imageCounter}
        />
      )}

      <footer>
        <img src="pacman-ghosts.jpg" alt="" />
      </footer>

      {paused && <FaPause className="playPause" />}
    </div>
  );

  return ret;
}

export default App;
