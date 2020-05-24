import React, { useState } from "react";

import Leaderboard from "./Leaderboard";

function App() {
  // If an error occured
  const [error, setError] = useState<string | null>(null);

  const ret = (
    <div className="App">
      <header>
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

      <Leaderboard baseURL="http://localhost:8000" setError={setError} />
    </div>
  );

  return ret;
}

export default App;
