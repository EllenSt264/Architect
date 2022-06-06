import axios from "axios";
import { GET_NOTES, NOTES_LOADING, NOTE_REQUEST_FAIL } from "./types";

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
