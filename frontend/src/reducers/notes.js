import {
  GET_NOTES,
  GET_NOTE,
  ADD_NOTE,
  NOTES_LOADING,
  NOTE_REQUEST_FAIL,
} from "../actions/types";

const initialState = {
  allnotes: [],
  targetNote: {},
  loading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTES_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_NOTES:
      const notesArr = [];
      action.payload.forEach((element) => {
        notesArr.push(element);
      });
      return {
        ...state,
        allnotes: notesArr,
        loading: false,
      };
    case GET_NOTE:
    case ADD_NOTE:
      return {
        ...state,
        targetNote: action.payload,
        loading: false,
      };
    case NOTE_REQUEST_FAIL:
      return {
        ...state,
        allnotes: [],
        targetNote: {},
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
