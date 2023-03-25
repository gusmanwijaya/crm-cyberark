import {
  GET_ALL_ACCOUNTS,
  ERROR_ALL_ACCOUNTS,
  SET_SEARCH_ACCOUNTS,
} from "./types";

import { setLoading } from "@/redux/loading/actions";
import { getAllAccounts } from "@/services/accounts";
import debounce from "debounce-promise";

const debouncedGetAll = debounce(getAllAccounts, 500);

const setSearch = (search) => {
  return {
    type: SET_SEARCH_ACCOUNTS,
    search,
  };
};

const setGetAllAccounts = (data, count, nextLink) => {
  return {
    type: GET_ALL_ACCOUNTS,
    data,
    count,
    nextLink,
  };
};

const setErrorAllAccounts = (error) => {
  return {
    type: ERROR_ALL_ACCOUNTS,
    error,
  };
};

const fetchAllAccounts = () => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));

    const params = {
      search: getState().accountsReducers?.search || "",
    };

    const response = await debouncedGetAll({
      search: params?.search,
    });

    if (response?.data?.statusCode === 200) {
      dispatch(
        setGetAllAccounts(
          response?.data?.data?.value,
          response?.data?.data?.count,
          response?.data?.data?.nextLink
        )
      );
      dispatch(setLoading(false));
    } else {
      dispatch(setErrorAllAccounts(response));
      dispatch(setLoading(false));
    }
  };
};

export { fetchAllAccounts, setSearch };
