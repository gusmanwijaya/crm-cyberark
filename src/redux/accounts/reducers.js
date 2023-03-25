import {
  GET_ALL_ACCOUNTS,
  ERROR_ALL_ACCOUNTS,
  SET_SEARCH_ACCOUNTS,
} from "./types";

const initialState = {
  search: "",
  count: 0,
  nextLink: "",
  data: [],
  error: {},
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ACCOUNTS:
      return {
        ...state,
        data: action.data,
        count: action.count,
        nextLink: action.nextLink,
      };

    case ERROR_ALL_ACCOUNTS:
      return {
        ...state,
        error: action.error,
      };

    case SET_SEARCH_ACCOUNTS:
      return {
        ...state,
        search: action.search,
      };

    default:
      return state;
  }
};

export default reducers;
