import { SET_LOADING } from "./types";

const initialState = {
  loading: false,
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };

    default:
      return state;
  }
};

export default reducers;
