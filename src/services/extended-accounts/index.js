import CallApi from "@/configs/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getExtendedAccounts(accountId) {
  const url = `${ROOT_API}/get-extended-accounts/${accountId}`;
  return CallApi({
    url,
    method: "GET",
    token: true,
  });
}
