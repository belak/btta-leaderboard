import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import cx from "classnames";
import Mousetrap from "mousetrap";

import { useInterval, useWindowSize } from "./utils";
import { useScores } from "./api";

type LeaderboardProps = {
  baseURL: string;
  setError: (err: string | null) => void;
};

function Leaderboard({ baseURL, setError }: LeaderboardProps) {
  // Page offset
  const [offset, setOffset] = useState(0);
  // Number on current page
  const [count, setCount] = useState(1);
  // Refresh is disabled on mobile
  const [refreshEnabled, setRefreshEnabled] = useState(false);

  const { data: scores, refresh: refreshScores, error } = useScores(baseURL);

  // When scores are updated, preload all relevant images
  useEffect(() => {
    // Preload all images
    scores.map(({ gameBannerThumbnail: src }) => {
      let image = new Image();
      image.src = src;
      return image;
    });
  }, [scores])

  // When the error state changes, propagate it up
  useEffect(() => {
    setError(error)
  }, [error, setError])

  const scoresRef = useRef<HTMLDivElement>(null);

  const refreshScoresWrapped = useCallback(() => {
    // Unfortunately, the simplest way to handle disabling refreshing is to
    // still tick, but not do anything.
    if (!refreshEnabled) {
      return;
    }

    refreshScores();
  }, [refreshEnabled, refreshScores]);

  // Fetch new scores every 30 seconds
  useInterval(refreshScoresWrapped, 30000);

  const nextPage = useCallback(() => {
    const newOffset = offset + count;
    const finalOffset = newOffset >= scores.length ? 0 : newOffset;
    if (finalOffset !== offset) {
      setOffset(finalOffset);
    }
  }, [offset, count, scores.length, setOffset]);

  // Jump to the next page every 9 seconds
  const resetNextPage = useInterval(nextPage, 9000);

  useEffect(() => {
    // Keybinds have a unique effect on nextPage - they reset the timer which
    // automatically jumps to the next page. Without this, there is a strange
    // behavior where you can arrow through pages and it will look like 2 were
    // skipped at the same time.
    const keybindNextPage = () => {
      nextPage();
      resetNextPage();
    }

    Mousetrap.bind("space", keybindNextPage);
    Mousetrap.bind("enter", keybindNextPage);
    Mousetrap.bind("right", keybindNextPage);

    return () => {
      Mousetrap.unbind("space");
      Mousetrap.unbind("enter");
      Mousetrap.unbind("right");
    };
  }, [nextPage, resetNextPage]);

  // When the window size changes if we're not on mobile, reset it to displaying
  // 1 so we can properly figure out how many items to display.
  const windowSize = useWindowSize();
  useLayoutEffect(() => {
    if (windowSize.width && windowSize.width > 1000) {
      setCount(1);
      setRefreshEnabled(true);
    } else {
      // On mobile, disable the refresh.
      setRefreshEnabled(false);
    }
  }, [windowSize, setCount, setRefreshEnabled]);

  useLayoutEffect(() => {
    if (!scoresRef.current) {
      return;
    }

    const width = windowSize.width || 0;

    // If we're on mobile, just display everything
    if (width < 1000) {
      setCount(scores.length);
      return;
    }

    const containerHeight = scoresRef.current.clientHeight;

    const firstScore = scoresRef.current.firstChild
      ?.firstChild as HTMLSpanElement | null;
    if (!firstScore) {
      return;
    }

    // Calculate how many items we can display. Note that the extra plus one
    // accounts for the line between rows.
    const newCount = Math.floor(
      containerHeight / (firstScore.clientHeight + 1)
    );
    if (count !== newCount) {
      setCount(newCount);
    }
  }, [count, setCount, scoresRef, scores.length, windowSize]);

  return (
    <div className="scoresContainer" ref={scoresRef}>
      <div className="scores">
        {scores.slice(offset, offset + count).map((item, idx) => {
          return (
            <React.Fragment key={item.id}>
              {idx !== 0 && <span className="line" />}
              <span
                className={cx("gameName", {
                  newScore: item.newScore,
                })}
              >
                <img src={item.gameBannerThumbnail} alt={item.gameName} />
              </span>
              <span
                className={cx("playerName", {
                  newScore: item.newScore,
                })}
              >
                {item.playerName}
              </span>
              <span
                className={cx("score", {
                  newScore: item.newScore,
                })}
              >
                {Number(item.playerScore).toLocaleString()}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Leaderboard;
