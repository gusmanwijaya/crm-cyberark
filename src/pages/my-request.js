import React, { useEffect, useState } from "react";

import { Button, Input, Modal, Table, Textarea } from "react-daisyui";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import HeadComponent from "@/components/HeadComponent";
import NavbarComponent from "@/components/NavbarComponent";
import FooterComponent from "@/components/FooterComponent";
import GapComponent from "@/components/GapComponent";

import { fetchAllMyRequests } from "@/redux/my-requests/actions";

import {
  deleteMyRequest,
  createBulkRequests,
  bulkDeletes,
} from "@/services/my-requests";
import Image from "next/image";

export default function MyRequest() {
  const dispatch = useDispatch();

  const [disabledButtonRequest, setDisabledButtonRequest] = useState(false);
  const [disabledButtonDelete, setDisabledButtonDelete] = useState(false);
  const [disabledButtonBulkDeletes, setDisabledButtonBulkDeletes] =
    useState(false);

  const [visibleRequest, setVisibleRequest] = useState(false);

  const toggleVisibleRequest = () => {
    setVisibleRequest(!visibleRequest);
  };

  const handleDelete = (requestId) => {
    Swal.fire({
      title: "Hapus request?",
      text: "Request yang telah dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E50914",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDisabledButtonDelete(true);
        const response = await deleteMyRequest(requestId);
        if (response?.data?.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: "Berhasil.",
            text: response?.data?.message || "Berhasil menghapus request.",
          });
          setDisabledButtonDelete(false);
          dispatch(fetchAllMyRequests());
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              response?.data?.message || "Nampaknya terjadi kesalahan di API.",
          });
          setDisabledButtonDelete(false);
        }
      }
    });
  };

  const { myRequests, total } = useSelector(
    (state) => state?.myRequestsReducers
  );
  const { loading } = useSelector((state) => state?.loadingReducers);

  useEffect(() => {
    dispatch(fetchAllMyRequests());
  }, [dispatch]);

  const defaultFromDate = `${new Date().getFullYear()}-${
    (new Date().getMonth() + 1).toString().length < 2
      ? `0${new Date().getMonth() + 1}`
      : `${new Date().getMonth() + 1}`
  }-${new Date().getDate()}T08:00`;

  const defaultToDate = `${new Date().getFullYear()}-${
    (new Date().getMonth() + 1).toString().length < 2
      ? `0${new Date().getMonth() + 1}`
      : `${new Date().getMonth() + 1}`
  }-${new Date().getDate() + 1}T23:30`;

  const [form, setForm] = useState({
    FromDate: Math.floor(new Date(defaultFromDate).getTime() / 1000),
    ToDate: Math.floor(new Date(defaultToDate).getTime() / 1000),
    Username: "",
    Address: "",
    Reason: "",
  });

  const handleBulkRequests = async () => {
    setDisabledButtonRequest(true);
    if (form?.Username !== "" && form?.Address !== "" && form?.Reason !== "") {
      const response = await createBulkRequests(form);
      if (response?.data?.statusCode === 201) {
        dispatch(fetchAllMyRequests());
        setVisibleRequest(false);
        setDisabledButtonRequest(false);

        if (response?.data?.data?.length > 0) {
          Swal.fire({
            icon: "success",
            title: "Berhasil Bulk Requests.",
            text:
              response?.data?.message || "Berhasil melakukan bulk requests.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Belum berhasil melakukan bulk requests.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            response?.data?.message || "Nampaknya terjadi kesalahan di API.",
        });
        setDisabledButtonRequest(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Silahkan lengkapi semua field.",
      });
      setDisabledButtonRequest(false);
    }
  };

  const handleBulkDeletes = async () => {
    Swal.fire({
      title: "Hapus semua requests?",
      text: "Requests yang telah dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E50914",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDisabledButtonBulkDeletes(true);
        const response = await bulkDeletes();
        if (response?.data?.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: "Berhasil Bulk Deletes.",
            text:
              response?.data?.message || "Berhasil menghapus semua requests.",
          });
          setDisabledButtonBulkDeletes(false);
          dispatch(fetchAllMyRequests());
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              response?.data?.message || "Nampaknya terjadi kesalahan di API.",
          });
          setDisabledButtonBulkDeletes(false);
        }
      }
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleBulkRequests();
    }
  };

  return (
    <>
      <HeadComponent />
      <NavbarComponent />

      <div className="px-4 lg:px-8 flex flex-row items-center space-x-2">
        <Button
          color="primary"
          size="sm"
          className="capitalize"
          onClick={toggleVisibleRequest}
        >
          Bulk Requests
        </Button>

        <Button
          onClick={handleBulkDeletes}
          className={`capitalize text-white ${
            disabledButtonBulkDeletes && "cursor-not-allowed"
          }`}
          disabled={disabledButtonBulkDeletes}
          color="accent"
          size="sm"
        >
          {disabledButtonBulkDeletes ? (
            <>
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              <p className="text-white">Loading...</p>
            </>
          ) : (
            "Bulk Deletes"
          )}
        </Button>
      </div>

      <GapComponent height={10} />

      <div className="mb-6 w-full h-screen flex flex-col px-4 lg:px-8">
        {loading ? (
          <div className="w-full h-1/2 flex justify-center items-center">
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 mr-3 text-slate-700 animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            <p className="text-slate-700">Loading...</p>
          </div>
        ) : total > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-full min-h-full">
              <Table.Head>
                <span />
                <span>Status</span>
                <span>Username</span>
                <span>Address</span>
                <span>Time Frame</span>
                <span>Requested On</span>
                <span>Permission On</span>
                <span>Access</span>
                <span>Reason</span>
              </Table.Head>

              <Table.Body>
                {myRequests?.length > 0 &&
                  myRequests?.map((value, index) => (
                    <Table.Row hover key={index}>
                      <span>
                        <Button
                          onClick={() => handleDelete(value?.RequestID)}
                          className={`capitalize text-white ${
                            disabledButtonDelete && "cursor-not-allowed"
                          }`}
                          disabled={disabledButtonDelete}
                          color="primary"
                          size="xs"
                        >
                          {disabledButtonDelete ? (
                            <>
                              <svg
                                aria-hidden="true"
                                role="status"
                                className="inline w-4 h-4 mr-3 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="#E5E7EB"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentColor"
                                />
                              </svg>
                              <p className="text-white">Loading...</p>
                            </>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      </span>
                      <span>{value?.StatusTitle || "-"}</span>
                      <span>
                        {value?.AccountDetails?.Properties?.UserName || "-"}
                      </span>
                      <span>
                        {value?.AccountDetails?.Properties?.Address || "-"}
                      </span>
                      <span>
                        {new Intl.DateTimeFormat("id-ID", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(value?.AccessFrom * 1000) || "-"}{" "}
                        -{" "}
                        {new Intl.DateTimeFormat("id-ID", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(value?.AccessTo * 1000) || "-"}
                      </span>
                      <span>
                        {new Intl.DateTimeFormat("id-ID", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(value?.CreationDate * 1000) || "-"}
                      </span>
                      <span>Connect</span>
                      <span>{value?.AccessType || "-"}</span>
                      <span>{value?.UserReason || "-"}</span>
                    </Table.Row>
                  ))}
              </Table.Body>

              <Table.Footer>
                <span className="capitalize">Total : {total}</span>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </Table.Footer>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <Image
              priority
              src="/empty.svg"
              width={450}
              height={450}
              alt="Empty Data"
            />
            <p className="text-center px-8 lg:px-0">
              Ooppss, nampaknya Anda belum memiliki request apapun.
            </p>
          </div>
        )}
      </div>

      {/* START: Modal Request */}
      <Modal open={visibleRequest} onClickBackdrop={toggleVisibleRequest}>
        <Modal.Header className="font-bold">Bulk Requests</Modal.Header>

        <Modal.Body>
          <div className="flex flex-col w-full component-preview p-4 items-center justify-center gap-2">
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text">From Date</span>
              </label>
              <Input
                value={defaultFromDate}
                name="FromDate"
                type="datetime-local"
                disabled
              />
            </div>

            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text">To Date</span>
              </label>
              <Input
                value={defaultToDate}
                name="ToDate"
                type="datetime-local"
                disabled
              />
            </div>

            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <Textarea
                name="Username"
                required
                onChange={(event) =>
                  setForm({ ...form, Username: event?.target?.value })
                }
                onKeyPress={handleKeyPress}
              />
              <p className="text-xs text-blue-500">
                Example: LIN.OPR.ROOT;ORA.OPR.SYS.EVDB;...
              </p>
            </div>

            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <Textarea
                name="Address"
                required
                onChange={(event) =>
                  setForm({ ...form, Address: event?.target?.value })
                }
                onKeyPress={handleKeyPress}
              />
              <p className="text-xs text-blue-500">
                Example: 10.254.161.62;10.254.161.64;...
              </p>
            </div>

            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text">Reason</span>
              </label>
              <Textarea
                name="Reason"
                required
                onChange={(event) =>
                  setForm({ ...form, Reason: event?.target?.value })
                }
                onKeyPress={handleKeyPress}
              />
            </div>

            <GapComponent height={20} />

            <div className="form-control w-full max-w-md">
              <Button
                onClick={handleBulkRequests}
                className={`capitalize text-white ${
                  disabledButtonRequest && "cursor-not-allowed"
                }`}
                disabled={disabledButtonRequest}
                color="primary"
              >
                {disabledButtonRequest ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    <p className="text-white">Loading...</p>
                  </>
                ) : (
                  "Bulk Requests"
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* END: Modal Request */}

      <FooterComponent />
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { tkn } = req.cookies;
  if (!tkn)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {},
  };
}
