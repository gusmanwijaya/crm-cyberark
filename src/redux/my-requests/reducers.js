import { GET_ALL_MY_REQUESTS, ERROR_ALL_MY_REQUESTS } from "./types";

const initialState = {
  myRequests: [],
  total: 0,
  error: {},
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_MY_REQUESTS:
      return {
        ...state,
        myRequests: action.myRequests,
        total: action.total,
      };

    case ERROR_ALL_MY_REQUESTS:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default reducers;
