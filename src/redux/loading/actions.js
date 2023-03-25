import { SET_LOADING } from "./types";

const setLoading = (loading) => {
  return {
    type: SET_LOADING,
    loading,
  };
};

export { setLoading };
