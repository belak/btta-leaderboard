import React, {
  useReducer,
  useCallback,
  useEffect,
  FunctionComponent,
} from "react";

import { fetchImages, fetchScores, Image, Score } from "./api";
import { useLocalStorage } from "./utils";

type InnerAPIState = {
  images: Image[];
  scores: Score[];
  error?: string;
};

type SetScoresAction = {
  type: "setScores";
  payload: Score[];
};

type SetImagesAction = {
  type: "setImages";
  payload: Image[];
};

type SetErrorAction = {
  type: "setError";
  payload: string;
};

type APIAction = SetImagesAction | SetScoresAction | SetErrorAction;

type APIState = {
  state: InnerAPIState;
  baseURL: string;
  refreshImages: () => Promise<void>;
  refreshScores: () => Promise<void>;
  setBaseURL: (baseURL: string) => void;
};

const APIContext = React.createContext<APIState | undefined>(undefined);

const apiReducer = (state: InnerAPIState, action: APIAction): InnerAPIState => {
  switch (action.type) {
    case "setImages":
      return {
        ...state,
        error: undefined,
        images: action.payload,
      };
    case "setScores":
      return {
        ...state,
        error: undefined,
        scores: action.payload,
      };
    case "setError":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialState: InnerAPIState = {
  images: [],
  scores: [],
};

const APIProvider: FunctionComponent = (props) => {
  const [baseURL, setBaseURL] = useLocalStorage(
    "leaderboardUrl",
    "https://btta-api.elwert.cloud"
  );

  const [state, dispatch] = useReducer(apiReducer, initialState);

  const refreshImages = useCallback(async () => {
    try {
      const data = await fetchImages(baseURL);
      dispatch({
        type: "setImages",
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: "setError",
        payload: e.toString(),
      });
    }
  }, [dispatch, baseURL]);

  const refreshScores = useCallback(async () => {
    try {
      const data = await fetchScores(baseURL);
      dispatch({
        type: "setScores",
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: "setError",
        payload: e.toString(),
      });
    }
  }, [dispatch, baseURL]);

  useEffect(() => {
    refreshImages();
    refreshScores();
  }, [refreshImages, refreshScores]);

  return (
    <APIContext.Provider
      value={{
        state,
        baseURL,
        refreshImages,
        refreshScores,
        setBaseURL,
      }}
    >
      {props.children}
    </APIContext.Provider>
  );
};

const useAPIState = (): APIState => {
  const context = React.useContext(APIContext);

  if (context === undefined) {
    throw new Error("useCountState must be used within a CountProvider");
  }

  return context;
};

export { useAPIState as default, APIProvider };
