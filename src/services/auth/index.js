import CallApi from "../../configs/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;
const API = "api";

export async function signIn(data) {
  const url = `${ROOT_API}/${API}/auth/LDAP/Logon`;
  return CallApi({ url, method: "POST", data });
}
