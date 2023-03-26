import {
  ERROR_ALL_EXTENDED_ACCOUNTS,
  GET_ALL_EXTENDED_ACCOUNTS,
} from "./types";

const initialState = {
  details: {},
  platform: {},
  availableTabs: {},
  actionsToDisplay: {},
  error: {},
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EXTENDED_ACCOUNTS:
      return {
        ...state,
        details: action.details,
        platform: action.platform,
        availableTabs: action.availableTabs,
        actionsToDisplay: action.actionsToDisplay,
      };

    case ERROR_ALL_EXTENDED_ACCOUNTS:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default reducers;
