import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import Leaderboard from "./Leaderboard";

type FormData = {
  url: string;
};

function App() {
  const { handleSubmit, register, setValue } = useForm<FormData>();

  // If an error occured
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const onSubmit = useCallback(
    handleSubmit(async (values: FormData) => {
      localStorage.leaderboardUrl = values.url;

      fetch(`${values.url}/api/scores`)
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
    [handleSubmit, setUrl]
  );

  const disconnect = useCallback(() => {
    setUrl(null);
    if (url) {
      // We need to do this on the next animation frame rather than now so the
      // form elements will exist.
      window.requestAnimationFrame(() => {
        setValue("url", url);
      });
    }
  }, [setUrl, setValue, url]);

  useEffect(() => {
    const url = localStorage.leaderboardUrl || "";
    setValue("url", url);

    if (url) {
      onSubmit();
    }
  }, [setValue, onSubmit]);

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

      {url ? (
        <Leaderboard baseURL={url} setError={setError} />
      ) : (
        <>
          URL: <input name="url" ref={register} />
          <button onClick={onSubmit}>Connect</button>
        </>
      )}
    </div>
  );

  return ret;
}

export default App;
