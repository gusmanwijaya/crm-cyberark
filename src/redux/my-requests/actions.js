import { GET_ALL_MY_REQUESTS, ERROR_ALL_MY_REQUESTS } from "./types";

import { setLoading } from "@/redux/loading/actions";
import { getMyRequests } from "@/services/my-requests";
import debounce from "debounce-promise";

const debouncedGetAll = debounce(getMyRequests, 1000);

const setGetAllMyRequests = (myRequests, idMyRequests, total) => {
  return {
    type: GET_ALL_MY_REQUESTS,
    myRequests,
    idMyRequests,
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
      const _tempIdMyRequests = [];
      for (const iterator of response?.data?.data?.MyRequests) {
        _tempIdMyRequests.push(iterator.AccountDetails.AccountID);
      }

      dispatch(
        setGetAllMyRequests(
          response?.data?.data?.MyRequests,
          _tempIdMyRequests || [],
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
