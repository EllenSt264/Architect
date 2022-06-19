import axios from "axios";
import {
  GET_NOTES,
  GET_NOTE,
  ADD_NOTE,
  EDIT_NOTE,
  DELETE_NOTE,
  NOTES_LOADING,
  NOTE_REQUEST_FAIL,
} from "./types";

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

export const addNote = (values) => async (dispatch) => {
  dispatch({ type: NOTES_LOADING });
  try {
    const res = await axios.post("/api/notes/", { body: values });
    dispatch({
      type: ADD_NOTE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTE_REQUEST_FAIL,
      payload: err.message,
    });
  }
};

export const editNote = (id, values) => async (dispatch) => {
  dispatch({ type: NOTES_LOADING });
  try {
    const res = await axios.put(`/api/notes/${id}/`, { body: values });
    dispatch({
      type: EDIT_NOTE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTE_REQUEST_FAIL,
      payload: err.message,
    });
  }
};

export const deleteNote = (id) => async (dispatch) => {
  dispatch({ type: NOTES_LOADING });
  try {
    await axios.delete(`/api/notes/${id}/`);
    dispatch({
      type: DELETE_NOTE,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: NOTE_REQUEST_FAIL,
      payload: err.message,
    });
  }
};
