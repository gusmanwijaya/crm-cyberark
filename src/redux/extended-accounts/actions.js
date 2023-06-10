import {
  ERROR_ALL_EXTENDED_ACCOUNTS,
  GET_ALL_EXTENDED_ACCOUNTS,
} from "./types";

import { getExtendedAccounts } from "@/services/extended-accounts";
import debounce from "debounce-promise";

const debouncedGetAll = debounce(getExtendedAccounts, 1000);

const setGetAllExtendedAccounts = (
  details,
  platform,
  availableTabs,
  actionsToDisplay
) => {
  return {
    type: GET_ALL_EXTENDED_ACCOUNTS,
    details,
    platform,
    availableTabs,
    actionsToDisplay,
  };
};

const setErrorAllExtendedAccounts = (error) => {
  return {
    type: ERROR_ALL_EXTENDED_ACCOUNTS,
    error,
  };
};

const fetchAllExtendedAccounts = (accountId) => {
  return async (dispatch) => {
    const response = await debouncedGetAll(accountId);

    if (response?.data?.statusCode === 200) {
      dispatch(
        setGetAllExtendedAccounts(
          response?.data?.data?.Details,
          response?.data?.data?.Platform,
          response?.data?.data?.AvailableTabs,
          response?.data?.data?.ActionsToDisplay
        )
      );
    } else {
      dispatch(setErrorAllExtendedAccounts(response));
    }
  };
};

export { fetchAllExtendedAccounts };
