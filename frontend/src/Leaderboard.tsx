import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { FlapDisplay, Presets } from "react-split-flap-effect";
import camelcaseKeys from "camelcase-keys";
import { parseISO, differenceInSeconds } from "date-fns";
import cx from "classnames";
import Mousetrap from "mousetrap";

import "react-split-flap-effect/extras/themes.css";

import { useInterval, useWindowSize, isHiDpi } from "./utils";

const buildImageUrl = (url: string): string => {
  if (!isHiDpi()) {
    return url;
  }

  const split = url.split(".");
  const ext = split.pop();
  const baseName = split.join(".");

  return ext ? `${baseName}@2x.${ext}` : url;
};

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
  // Refresh is disabled on mobile
  const [refreshEnabled, setRefreshEnabled] = useState(false);

  const scoresRef = useRef<HTMLDivElement>(null);

  const refreshScores = useCallback(async () => {
    try {
      const resp = await fetch(`${baseURL}/api/scores/`);
      if (resp.status === 200) {
        const data = camelcaseKeys(await resp.json(), {
          deep: true,
        }) as ScoreResponse[];

        const cur = new Date();

        const newData = data.map((item) => {
          const modified = parseISO(item.modified);
          const created = parseISO(item.created);

          const newScore =
            modified > created &&
            differenceInSeconds(cur, modified) < 3600 * 24 * 30;
          return {
            ...item,
            //newScore: Math.random() >= 0.8,
            gameBannerThumbnail: buildImageUrl(item.gameBannerThumbnail),
            newScore,
          };
        });

        // Any score modified than a day ago should be counted as new.
        setData(newData);

        // Now that we had a successful request, clear any existing errors.
        setError(null);

        // Preload all images
        newData.map(({ gameBannerThumbnail: src }) => {
          let image = new Image();
          image.src = src;
          return image;
        });
      } else {
        const text = await resp.text();
        setError("Failed to get scores: " + text);
      }
    } catch (e) {
      setError("Failed to get scores: " + e);
    }
  }, [baseURL, setData, setError]);

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

  // Call fetchNewScores on the page load
  useEffect(() => {
    refreshScores();
  }, [refreshScores]);

  const nextPage = useCallback(() => {
    const newOffset = offset + count;
    const finalOffset = newOffset >= data.length ? 0 : newOffset;
    if (finalOffset !== offset) {
      setOffset(finalOffset);
    }
  }, [offset, count, data, setOffset]);

  // Jump to the next page every 9 seconds
  useInterval(nextPage, 15000);

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
      setCount(data.length);
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
  }, [count, setCount, scoresRef, data, windowSize]);

  return (
    <div className="scoresContainer" ref={scoresRef}>
      <div className="scores">
        {data.slice(offset, offset + count).map((item, idx) => {
          return (
            <React.Fragment key={idx}>
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
                <FlapDisplay
                  className={cx("darkBordered", "L")}
                  chars={Presets.ALPHANUM + ",.!?"}
                  length={12}
                  value={item.playerName}
                  timing={30}
                />

                <FlapDisplay
                  className={cx("darkBordered", "L")}
                  chars={Presets.NUM + ","}
                  length={8}
                  value={Number(item.playerScore).toLocaleString()}
                  timing={3}
                />
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Leaderboard;
