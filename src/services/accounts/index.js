import CallApi from "@/configs/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getAllAccounts({
  search,
  searchType,
  sort,
  offset = 0,
  limit = 1000,
  filter,
}) {
  const url = `${ROOT_API}/get-all-accounts`;
  return CallApi({
    url,
    method: "GET",
    params: {
      search,
      searchType,
      sort,
      offset,
      limit,
      filter,
    },
    token: true,
  });
}
