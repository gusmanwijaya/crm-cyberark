import { GET_ALL_MY_REQUESTS, ERROR_ALL_MY_REQUESTS } from "./types";

import { setLoading } from "@/redux/loading/actions";
import { getMyRequests } from "@/services/my-requests";
import debounce from "debounce-promise";

const debouncedGetAll = debounce(getMyRequests, 3000);

const setGetAllMyRequests = (myRequests, total) => {
  return {
    type: GET_ALL_MY_REQUESTS,
    myRequests,
    total,
  };
};

const setErrorAllMyRequests = (error) => {
  return {
    type: ERROR_ALL_MY_REQUESTS,
    error,
  };
};

const fetchAllMyRequests = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    const response = await debouncedGetAll();

    if (response?.data?.statusCode === 200) {
      dispatch(
        setGetAllMyRequests(
          response?.data?.data?.MyRequests,
          response?.data?.data?.Total
        )
      );
      dispatch(setLoading(false));
    } else {
      dispatch(setErrorAllMyRequests(response));
      dispatch(setLoading(false));
    }
  };
};

export { fetchAllMyRequests };
