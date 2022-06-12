import { createStore } from "redux";
import rootReducer from "./index";

import notes from "./notes";
import { GET_NOTES, GET_NOTE } from "../actions/types";

const notesReducer = notes;

const initialState = {
  allnotes: [],
  targetNote: {},
  loading: false,
  error: null,
};

describe("Root Reducer", () => {
  let store = createStore(rootReducer);
  it("should load correctly", () => {
    expect(store.getState().notes).toEqual(initialState);
  });
});

describe("Notes reducer", () => {
  const mynotes = [
    { body: "foo", id: 1 },
    { body: "bar", id: 2 },
  ];

  it("should return the initial state correctly", () => {
    const newState = notesReducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it("should handle GET_NOTES as intended", () => {
    const newState = notesReducer(undefined, {
      type: GET_NOTES,
      payload: mynotes,
    });
    expect(newState.allnotes).toEqual(mynotes);
    expect(newState.loading).toEqual(false);
    expect(newState.error).toEqual(null);
  });

  it("should handle GET_NOTE as intended", () => {
    const mynote = { 1: { id: 1, body: "foo" } };
    const newState = notesReducer(undefined, {
      type: GET_NOTE,
      payload: mynote,
    });
    expect(newState.targetNote).toEqual(mynote);
    expect(newState.loading).toEqual(false);
    expect(newState.error).toEqual(null);
  });

  it("should handle NOTES_LOADING as intended", () => {
    const newState = notesReducer(initialState, { type: "NOTES_LOADING" });
    expect(newState).toEqual({
      allnotes: [],
      targetNote: {},
      loading: true,
      error: null,
    });
  });

  it("should handle NOTE_REQUEST_FAIL as intended", () => {
    const newState = notesReducer(undefined, {
      type: "NOTES_REQUEST_FAIL",
      payload: "Error!",
    });
    expect(newState.error).toEqual("Error!");
    expect(newState.loading).toEqual(false);
    expect(newState.allnotes).toEqual([]);
    expect(newState.targetNote).toEqual({});
  });
});
