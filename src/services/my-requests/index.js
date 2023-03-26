import CallApi from "@/configs/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;

export async function getMyRequests() {
  const url = `${ROOT_API}/get-my-requests`;
  return CallApi({
    url,
    method: "GET",
    token: true,
  });
}

export async function createBulkRequests(data) {
  const url = `${ROOT_API}/bulk-requests`;
  return CallApi({
    url,
    method: "POST",
    data,
    token: true,
  });
}

export async function deleteMyRequest(requestId) {
  const url = `${ROOT_API}/delete-my-request/${requestId}`;
  return CallApi({
    url,
    method: "DELETE",
    token: true,
  });
}

export async function bulkDeletes() {
  const url = `${ROOT_API}/bulk-deletes`;
  return CallApi({
    url,
    method: "DELETE",
    token: true,
  });
}
