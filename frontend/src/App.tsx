import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import camelcaseKeys from "camelcase-keys";
import { parseISO, differenceInSeconds } from "date-fns";
import cx from "classnames";

type ScoreResponse = {
  id: number;
  gameName: string;
  gameBanner: string;
  playerName: string;
  playerScore: number;
  created: string;
  modified: string;
};

type Score = {
  id: number;
  gameName: string;
  gameBanner: string;
  playerName: string;
  playerScore: number;
  newScore: boolean;
};

function App() {
  // Page offset
  const [offset, setOffset] = useState(0);
  // Number on current page
  const [count, setCount] = useState(1);
  // If an error occured
  const [error, setError] = useState<string | null>(null);
  // All score data
  const [data, setData] = useState<Score[]>([]);

  const scoresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callback = async () => {
      try {
        const resp = await fetch("http://localhost:8000/api/scores");
        if (resp.status === 200) {
          const data = camelcaseKeys(await resp.json(), {
            deep: true,
          }) as ScoreResponse[];

          // Any score modified than a day ago should be counted as new
          setData(
            data.map((item) => ({
              ...item,
              newScore:
                differenceInSeconds(new Date(), parseISO(item.modified)) <
                3600 * 24,
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
    };

    // Kick off the callback once so we don't need to wait 5 seconds for
    // results.
    callback();

    const interval = setInterval(callback, 5000);
    return () => clearInterval(interval);
  }, [setData, setError]);

  useLayoutEffect(() => {
    const callback = () => {
      if (!scoresRef.current) {
        return;
      }

      const containerHeight = scoresRef.current.clientHeight;

      const firstScore = scoresRef.current.firstChild
        ?.firstChild as HTMLSpanElement | null;
      if (!firstScore) {
        return;
      }

      // Calculate how many items we can display. NOTE: this will not shrink
      // after the page is reloaded, but it calculates the right number and this
      // will be a static page, so it's good enough for me.
      const newCount = Math.floor(containerHeight / firstScore.clientHeight);
      if (count !== newCount) {
        setCount(newCount);
      }

      // Set the new offset - reset to the first page if we went past the end.
      const newOffset = offset + count;
      const finalOffset = newOffset >= data.length ? 0 : newOffset;
      if (finalOffset !== offset) {
        setOffset(finalOffset);
      }
    };

    const interval = setInterval(callback, 1000);
    return () => clearInterval(interval);
  }, [data, count, offset, setOffset, setCount, scoresRef]);

  const ret = (
    <div className="App">
      <header>
        <img src="logo.png" alt="Back to the Arcade" width="500px" />
        <h2>Leaderboard</h2>
      </header>

      {error && (
        <div>
          <h2>Error Fetching Scores:</h2>
          {error}
        </div>
      )}

      <div
        className="scoresContainer"
        ref={scoresRef}
      >
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
                  <img src={item.gameBanner} alt={item.gameName} />
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
    </div>
  );

  return ret;
}

export default App;
