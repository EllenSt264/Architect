import axios from "axios";
import { GET_NOTES, GET_NOTE, NOTES_LOADING, NOTE_REQUEST_FAIL } from "./types";

export const getNotes = () => async (dispatch) => {
  dispatch({ type: NOTES_LOADING });
  try {
    const res = await axios.get("/api/notes/");
    dispatch({
      type: GET_NOTES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTE_REQUEST_FAIL,
      payload: err.message,
    });
  }
};

export const getNote = (id) => async (dispatch) => {
  dispatch({ type: NOTES_LOADING });
  try {
    const res = await axios.get(`/api/notes/${id}/`);
    dispatch({
      type: GET_NOTE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTE_REQUEST_FAIL,
      payload: err.message,
    });
  }
};
