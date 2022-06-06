import { GET_NOTES, NOTES_LOADING, NOTE_REQUEST_FAIL } from "../actions/types";

const initialState = { notes: [], targetNote: {}, loading: false, error: null };

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
        notes: notesArr,
        loading: false,
      };
    case NOTE_REQUEST_FAIL:
      return {
        ...state,
        notes: [],
        targetNote: {},
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
