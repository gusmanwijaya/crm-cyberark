import axios from "axios";
import Cookies from "js-cookie";

export default async function CallApi({
  url,
  method,
  data,
  token,
  serverToken,
}) {
  let headers = {};

  if (serverToken) {
    headers = {
      Authorization: `${serverToken}`,
    };
  } else if (token) {
    const tokenCookies = Cookies.get("tkn");
    if (tokenCookies) {
      headers = {
        Authorization: `${tokenCookies}`,
      };
    }
  }

  const response = await axios({
    url,
    method,
    data,
    headers,
  }).catch((error) => error.response);

  return response;
}
