import { useState, useCallback, useEffect } from "react";
import { differenceInSeconds, parseISO } from "date-fns";
import camelcaseKeys from "camelcase-keys";
import { buildImageUrl } from "./utils";

type HookResponse<T> = {
  data: T[];
  refresh: () => Promise<void>;
  error: string | null;
};

type ScoreAPIResponse = {
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

const useScores = (baseURL: string): HookResponse<Score> => {
  const [scores, setScores] = useState<Score[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const resp = await fetch(`${baseURL}/api/scores/`);
      if (resp.status === 200) {
        const data = camelcaseKeys(await resp.json(), {
          deep: true,
        }) as ScoreAPIResponse[];

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
        setScores(newData);

        // Now that we had a successful request, clear any existing errors.
        setError(null);
      } else {
        const text = await resp.text();
        setError("Failed to get scores: " + text);
      }
    } catch (e) {
      setError("Failed to get scores: " + e);
    }
  }, [baseURL, setScores, setError]);

  // Force refresh on load
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data: scores,
    refresh,
    error,
  };
};

type Image = {
  name: string;
  image: string;
};

const useImages = (baseURL: string): HookResponse<Image> => {
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const resp = await fetch(`${baseURL}/api/images/`);
      if (resp.status === 200) {
        const data = camelcaseKeys(await resp.json(), {
          deep: true,
        }) as Image[];

        setImages(data);

        // Now that we had a successful request, clear any existing errors.
        setError(null);
      } else {
        const text = await resp.text();
        setError("Failed to get scores: " + text);
      }
    } catch (e) {
      setError("Failed to get scores: " + e);
    }
  }, [baseURL, setImages, setError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data: images,
    refresh,
    error,
  };
};

export type { Score, Image };

export { useScores, useImages };
