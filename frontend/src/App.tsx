import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import Leaderboard from "./Leaderboard";
import { useLocalStorage } from "./utils";

type FormData = {
  url: string;
};

function App() {
  const { handleSubmit, register, setValue } = useForm<FormData>();

  // If an error occured
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [url, setUrl] = useLocalStorage(
    "leaderboardUrl",
    "https://btta-api.elwert.cloud"
  );

  const onSubmit = useCallback(
    handleSubmit(async (values: FormData) => {
      localStorage.leaderboardUrl = values.url;

      setConnected(true);

      fetch(`${values.url}/api/scores/`)
        .then((resp) => {
          // On successful connection, mark us as connected.
          if (resp.status === 200) {
            setError(null);
            setUrl(values.url);
          } else {
            setError(`Unexpected status code: ${resp.status}`);
          }
        })
        .catch((e) => {
          setError(`Connection error: ${e}`);
        });
    }),
    [handleSubmit, setUrl, setConnected]
  );

  const disconnect = useCallback(() => {
    setConnected(false);

    // We need to do this on the next animation frame rather than now so the
    // form elements will exist.
    window.requestAnimationFrame(() => {
      setValue("url", url);
    });
  }, [setConnected, setValue, url]);

  // On startup, if there's a provided URL, mark us as connected.
  useEffect(() => {
    if (url) {
      setConnected(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ret = (
    <div className="App">
      <header onClick={disconnect}>
        <img className="logo" src="logo.png" alt="Back to the Arcade" />
        <img
          className="leaderboard"
          src="leaderboard-text.png"
          alt="Leaderboard"
        />
      </header>

      {error && (
        <div>
          <h2>Error:</h2>
          {error}
        </div>
      )}

      {connected ? (
        <Leaderboard baseURL={url} setError={setError} />
      ) : (
        <>
          URL: <input name="url" ref={register} />
          <button onClick={onSubmit}>Connect</button>
        </>
      )}

      <footer>
        <img src="pacman-ghosts.jpg" alt="" />
      </footer>
    </div>
  );

  return ret;
}

export default App;
