import React, { useReducer, useCallback, useEffect } from "react";
import { RESET, SEARCH, UPDATE_RESULTS, DELETE_IMAGE } from "./types/types";
import { imageReducer } from "./reducers/reducer";
import { initialState } from "./initialState";
import { key } from "../constants/apiKey";

const ImageGalleryContext = React.createContext();

function ImageGalleryContextProvider(props) {
  const [state, dispatch] = useReducer(imageReducer, initialState);

  const resetState = useCallback(() => {
    dispatch({
      type: RESET,
    });
  }, [dispatch]);

  const updateSearchQuery = useCallback(
    (query) => {
      dispatch({
        type: SEARCH,
        payload: query,
      });
    },
    [dispatch]
  );

  const updateResults = useCallback(
    (results) => {
      dispatch({
        type: UPDATE_RESULTS,
        payload: results,
      });
    },
    [dispatch]
  );

  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      headers: { Authorization: key },
    };
    if (state.query !== "") {
      fetch(
        `https://api.pexels.com/v1/search?per_page=80&query=${state.query}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((response) => {
          updateResults(response);
        });
    } else {
      updateResults([]);
    }
  }, [state.query, updateResults]);

  const deleteImage = useCallback(
    (imageID) => {
      dispatch({
        type: DELETE_IMAGE,
        payload: imageID,
      });
    },
    [dispatch]
  );  

  return (
    <ImageGalleryContext.Provider
      value={{ state, resetState, updateSearchQuery, deleteImage }}
    >
      {props.children}
    </ImageGalleryContext.Provider>
  );
}

export { ImageGalleryContextProvider, ImageGalleryContext };
