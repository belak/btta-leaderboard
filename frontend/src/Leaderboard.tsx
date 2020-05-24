import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import camelcaseKeys from "camelcase-keys";
import { parseISO, differenceInSeconds } from "date-fns";
import cx from "classnames";
import Mousetrap from "mousetrap";

import RetinaImage from './RetinaImage'
import { useInterval, useWindowSize } from "./utils";

type ScoreResponse = {
  id: number;
  gameName: string;
  gameBanner: string;
  gameBannerThumbnail: string;
  playerName: string;
  playerScore: number;
  created: string;
  modified: string;
};

type Score = {
  id: number;
  gameName: string;
  gameBanner: string;
  gameBannerThumbnail: string;
  playerName: string;
  playerScore: number;
  newScore: boolean;
};

type LeaderboardProps = {
  baseURL: string;
  setError: (err: string | null) => void;
};

function Leaderboard({ baseURL, setError }: LeaderboardProps) {
  // Page offset
  const [offset, setOffset] = useState(0);
  // Number on current page
  const [count, setCount] = useState(1);
  // All score data
  const [data, setData] = useState<Score[]>([]);

  const scoresRef = useRef<HTMLDivElement>(null);

  const fetchNewScores = useCallback(async () => {
    try {
      const resp = await fetch(`${baseURL}/api/scores/`);
      if (resp.status === 200) {
        const data = camelcaseKeys(await resp.json(), {
          deep: true,
        }) as ScoreResponse[];

        // Any score modified than a day ago should be counted as new.
        setData(
          data.map((item) => ({
            ...item,
            newScore: Math.random() >= 0.8,
            /*
            newScore:
              differenceInSeconds(new Date(), parseISO(item.modified)) <
              3600 * 24 * 30,
            */
          }))
        );

        // Now that we had a successful request, clear any existing errors.
        setError(null);
      } else {
        const text = await resp.text();
        setError("Failed to get scores: " + text);
      }
    } catch (e) {
      setError("Failed to get scores: " + e);
    }
  }, [baseURL, setData, setError]);

  // Fetch new scores every 30 seconds
  useInterval(fetchNewScores, 30000);

  // Call fetchNewScores on the page load
  useEffect(() => {
    fetchNewScores();
  }, [fetchNewScores]);

  const nextPage = useCallback(() => {
    const newOffset = offset + count;
    const finalOffset = newOffset >= data.length ? 0 : newOffset;
    if (finalOffset !== offset) {
      setOffset(finalOffset);
    }
  }, [offset, count, data, setOffset]);

  // Jump to the next page every 10 seconds
  useInterval(nextPage, 10000);

  useEffect(() => {
    Mousetrap.bind("space", nextPage);
    Mousetrap.bind("enter", nextPage);
    Mousetrap.bind("right", nextPage);

    return () => {
      Mousetrap.unbind("space");
      Mousetrap.unbind("enter");
      Mousetrap.unbind("right");
    };
  }, [nextPage]);

  // When the window size changes if we're not on mobile, reset it to displaying
  // 1 so we can properly figure out how many items to display.
  const windowSize = useWindowSize();
  useLayoutEffect(() => {
    if (windowSize.width && windowSize.width > 1000) {
      setCount(1);
    }
  }, [windowSize, setCount]);

  useLayoutEffect(() => {
    if (!scoresRef.current) {
      return;
    }

    const width = windowSize.width || 0;

    // If we're on mobile, just display everything
    if (width < 1000) {
      setCount(data.length);
      return;
    }

    const containerHeight = scoresRef.current.clientHeight;

    const firstScore = scoresRef.current.firstChild
      ?.firstChild as HTMLSpanElement | null;
    if (!firstScore) {
      return;
    }

    // Calculate how many items we can display.
    //
    // NOTE: this will not shrink after the page is reloaded, but it
    // calculates the right number and this will be a static page, so it's
    // good enough for me.
    const newCount = Math.floor(containerHeight / firstScore.clientHeight);
    if (count !== newCount) {
      setCount(newCount);
    }
  }, [count, setCount, scoresRef, data, windowSize]);

  return (
    <div className="scoresContainer" ref={scoresRef}>
      <div className="scores">
        {data.slice(offset, offset + count).map((item, idx) => {
          return (
            <React.Fragment key={item.id}>
              {idx !== 0 && <span className="line" />}
              <span
                className={cx("gameName", {
                  newScore: item.newScore,
                })}
              >
                <RetinaImage src={item.gameBannerThumbnail} alt={item.gameName} />
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
