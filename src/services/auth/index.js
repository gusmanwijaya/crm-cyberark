import CallApi from "@/configs/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function signIn(data) {
  const url = `${ROOT_API}/sign-in`;
  return CallApi({ url, method: "POST", data });
}
