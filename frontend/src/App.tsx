import React, { useEffect, useState } from "react";
import camelcaseKeys from "camelcase-keys";

type ScoreResponse = {
  gameSlug: string;
  gameName: string;
  gameBanner: string;
  playerName: string;
  playerScore: number;
};

function App() {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScoreResponse[]>([]);

  useEffect(() => {
    const callback = async () => {
      try {
        const resp = await fetch("http://localhost:8000/api/scores");
        if (resp.status === 200) {
          setError(null);
          setData(
            camelcaseKeys(await resp.json(), { deep: true }) as ScoreResponse[]
          );
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

  return (
    <div className="App">
      <header>
        <img src="logo.png" width="500px" />
        <h2>Leaderboard</h2>
      </header>

      {error && (
        <div>
          <h2>Error Fetching Scores:</h2>
          {error}
        </div>
      )}

      <div className="Scores">
        {data.map((item, idx) => (
          <React.Fragment key={item.gameSlug}>
            {idx !== 0 && <hr />}
            <span className="GameName">
              <img src={item.gameBanner} alt={item.gameName} />
            </span>
            <span className="PlayerName">{item.playerName}</span>
            <span className="Score">
              {Number(item.playerScore).toLocaleString()}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default App;
