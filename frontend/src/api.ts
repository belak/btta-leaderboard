import { differenceInSeconds, parseISO } from "date-fns";
import camelcaseKeys from "camelcase-keys";
import { buildImageUrl } from "./utils";

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

const fetchScores = async (baseURL: string): Promise<Score[]> => {
  try {
    const resp = await fetch(`${baseURL}/api/scores/`);
    if (resp.status === 200) {
      const data = camelcaseKeys(await resp.json(), {
        deep: true,
      }) as ScoreAPIResponse[];

      const cur = new Date();

      return data.map((item) => {
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
    } else {
      const text = await resp.text();
      throw "Failed to get scores: " + text;
    }
  } catch (e) {
    throw "Failed to get scores: " + e;
  }
};

type Image = {
  name: string;
  image: string;
};

const fetchImages = async (baseURL: string): Promise<Image[]> => {
  try {
    const resp = await fetch(`${baseURL}/api/images/`);
    if (resp.status === 200) {
      const data = camelcaseKeys(await resp.json(), {
        deep: true,
      }) as Image[];

      return data;
    } else {
      const text = await resp.text();
      throw "Failed to get scores: " + text;
    }
  } catch (e) {
    throw "Failed to get scores: " + e;
  }
};

export type { Score, Image };

export { fetchImages, fetchScores };
