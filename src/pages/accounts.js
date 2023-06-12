import React, { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  FileInput,
  Input,
  Modal,
  Table,
  Textarea,
} from "react-daisyui";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import exportFromJSON from "export-from-json";
import { useRouter } from "next/router";

import HeadComponent from "@/components/HeadComponent";
import NavbarComponent from "@/components/NavbarComponent";
import FooterComponent from "@/components/FooterComponent";
import GapComponent from "@/components/GapComponent";

import { fetchAllAccounts, setSearch } from "@/redux/accounts/actions";
import { createBulkRequests } from "@/services/my-requests";

export default function Accounts() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, search } = useSelector((state) => state?.accountsReducers);
  const { idMyRequests } = useSelector((state) => state?.myRequestsReducers);
  const { loading } = useSelector((state) => state?.loadingReducers);

  const handleChangeSearchBox = (event) => {
    dispatch(setSearch(event?.target?.value));
  };

  const handleKeyPressSearch = (event) => {
    if (event.key === "Enter") {
      handleChangeSearchBox(event);
    }
  };

  const today = new Date().toLocaleDateString();
  const todayDate = today.split("/")[1];
  const todayDateTwoDigit =
    todayDate.toString().length < 2 ? `0${todayDate}` : `${todayDate}`;
  const todayMonth = today.split("/")[0];
  const todayMonthTwoDigit =
    todayMonth.toString().length < 2 ? `0${todayMonth}` : `${todayMonth}`;
  const todayYear = today.split("/")[2];

  const defaultFromDate = `${todayYear}-${todayMonthTwoDigit}-${todayDateTwoDigit}T08:00`;

  const dayNow = new Date();
  const tempTomorrow = new Date(dayNow);
  tempTomorrow.setDate(dayNow.getDate() + 1);
  const tomorrow = tempTomorrow.toLocaleDateString();
  const tomorrowDate = tomorrow.split("/")[1];
  const tomorrowDateTwoDigit =
    tomorrowDate.toString().length < 2 ? `0${tomorrowDate}` : `${tomorrowDate}`;
  const tomorrowMonth = tomorrow.split("/")[0];
  const tomorrowMonthTwoDigit =
    tomorrowMonth.toString().length < 2
      ? `0${tomorrowMonth}`
      : `${tomorrowMonth}`;
  const tomorrowYear = tomorrow.split("/")[2];

  const defaultToDate = `${tomorrowYear}-${tomorrowMonthTwoDigit}-${tomorrowDateTwoDigit}T23:30`;

  const [form, setForm] = useState({
    file: "",
    FromDate: Math.floor(new Date(defaultFromDate).getTime() / 1000),
    ToDate: Math.floor(new Date(defaultToDate).getTime() / 1000),
    Username: "",
    Address: "",
    Reason: "",
  });

  useEffect(() => {
    dispatch(fetchAllAccounts());
  }, [dispatch, search]);

  // START: Import CSV
  const [disabledButtonRequestImportCSV, setDisabledButtonRequestImportCSV] =
    useState(false);
  const [visibleImportCSV, setVisibleImportCSV] = useState(false);

  const toggleVisibleImportCSV = () => {
    setVisibleImportCSV(!visibleImportCSV);
  };

  const handleUploadCSV = (event) => {
    if (event.target.files.length > 0) {
      setForm({
        ...form,
        file: event.target.files[0],
      });
    }
  };

  const handleBulkRequestsImportCSV = async () => {
    setDisabledButtonRequestImportCSV(true);

    setForm({
      ...form,
      Username: "",
      Address: "",
    });

    if (form?.file !== "") {
      if (form?.Reason !== "") {
        const formData = new FormData();
        formData.append("FromDate", form?.FromDate);
        formData.append("ToDate", form?.ToDate);
        formData.append("file", form?.file);
        formData.append("Reason", form?.Reason);

        const response = await createBulkRequests(formData);
        if (response?.data?.statusCode === 201) {
          setVisibleImportCSV(false);
          setDisabledButtonRequestImportCSV(false);
          if (response?.data?.data?.length > 0) {
            Swal.fire({
              icon: "success",
              title: "Berhasil Bulk Requests.",
              text:
                response?.data?.message || "Berhasil melakukan bulk requests.",
            });
            router.push("/my-request");
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
          setDisabledButtonRequestImportCSV(false);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Silahkan lengkapi field reason.",
        });
        setDisabledButtonRequestImportCSV(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Silahkan upload file .csv",
      });
      setDisabledButtonRequestImportCSV(false);
    }
  };
  // END: Import CSV

  // =======================================================================

  // START: Requests
  const [disabledButtonRequest, setDisabledButtonRequest] = useState(false);
  const [visibleRequest, setVisibleRequest] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState([]);

  const handleChange = (event) => {
    // Destructuring
    const { value, checked } = event.target;

    // Case 1 : The user checks the box
    if (checked) {
      setCheckboxValue([...checkboxValue, value]);
    }

    // Case 2  : The user unchecks the box
    else {
      setCheckboxValue(checkboxValue.filter((result) => result !== value));
    }
  };

  const toggleVisibleRequest = () => {
    const _tempUsername = [];
    const _tempAddress = [];

    if (checkboxValue.length > 0) {
      for (const iterator of checkboxValue) {
        _tempUsername.push(iterator.split("|")[0]);
        _tempAddress.push(iterator.split("|")[1]);
      }

      const uniqTempUsername = [...new Set(_tempUsername)];
      const uniqTempAddress = [...new Set(_tempAddress)];

      setForm({
        ...form,
        Username: uniqTempUsername.join(";"),
        Address: uniqTempAddress.join(";"),
      });
    }

    setVisibleRequest(!visibleRequest);
  };

  const handleExportToCSV = () => {
    const data = [
      {
        Username: form?.Username.replaceAll(";", "-") || "",
        Address: form?.Address.replaceAll(";", "-") || "",
      },
    ];
    const fileName = form?.Reason;
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType, delimiter: "," });
  };

  const handleBulkRequests = async () => {
    setDisabledButtonRequest(true);

    setForm({
      ...form,
      file: "",
    });

    if (form?.Username !== "" && form?.Address !== "" && form?.Reason !== "") {
      const response = await createBulkRequests(form);
      if (response?.data?.statusCode === 201) {
        setVisibleRequest(false);
        setDisabledButtonRequest(false);
        if (response?.data?.data?.length > 0) {
          Swal.fire({
            icon: "success",
            title: "Berhasil Bulk Requests.",
            text:
              response?.data?.message || "Berhasil melakukan bulk requests.",
          });
          router.push("/my-request");
          handleExportToCSV();
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
  // END: Requests

  return (
    <>
      <HeadComponent />
      <NavbarComponent />
      <div className="mb-6 w-full h-screen flex flex-col px-4 lg:px-8">
        <div className="mb-6 flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:space-x-2 lg:justify-between lg:items-end">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Cari</span>
            </label>
            <Input
              name="search"
              type="search"
              onKeyPress={handleKeyPressSearch}
            />
          </div>
          <div className="flex flex-row justify-center items-center">
            <div className="form-control w-full max-w-xs">
              <Button
                color="success"
                size="md"
                className="capitalize text-white"
                onClick={toggleVisibleImportCSV}
              >
                Import CSV
              </Button>
            </div>
            <GapComponent width={20} />
            <div className="form-control w-full max-w-xs">
              <Button
                color="primary"
                size="md"
                className="capitalize"
                onClick={toggleVisibleRequest}
                disabled={checkboxValue.length > 0 ? false : true}
              >
                Requests
              </Button>
            </div>
          </div>
        </div>

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
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full min-h-full">
              <Table.Head>
                <span />
                <span>Username</span>
                <span>Address</span>
                <span>Platform ID</span>
                <span>Safe</span>
                <span>Name</span>
              </Table.Head>

              <Table.Body>
                {data?.length > 0 &&
                  data?.map((value, index) => (
                    <Table.Row hover key={index}>
                      <Checkbox
                        onChange={(event) => handleChange(event)}
                        value={`${value?.userName || "-"}|${
                          value?.address || "-"
                        }`}
                        disabled={
                          idMyRequests.includes(value?.id) ? true : false
                        }
                      />
                      <span>{value?.userName || "-"}</span>
                      <span>{value?.address || "-"}</span>
                      <span>{value?.platformId || "-"}</span>
                      <span>{value?.safeName || "-"}</span>
                      <span>{value?.name || "-"}</span>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>

      {/* START: Modal Import CSV */}
      <Modal open={visibleImportCSV} onClickBackdrop={toggleVisibleImportCSV}>
        <Modal.Header className="font-bold">Bulk Requests</Modal.Header>

        <Modal.Body>
          <div className="flex flex-col w-full component-preview p-4 items-center justify-center gap-2">
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text">Import CSV</span>
              </label>
              <FileInput
                type="file"
                name="file"
                accept="text/csv"
                onChange={(event) => handleUploadCSV(event)}
              />
            </div>

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
                <span className="label-text">Reason</span>
              </label>
              <Textarea
                name="Reason"
                required
                onChange={(event) =>
                  setForm({ ...form, Reason: event?.target?.value })
                }
              />
            </div>

            <GapComponent height={20} />

            <div className="form-control w-full max-w-md">
              <Button
                onClick={handleBulkRequestsImportCSV}
                className={`capitalize text-white ${
                  disabledButtonRequestImportCSV && "cursor-not-allowed"
                }`}
                disabled={disabledButtonRequestImportCSV}
                color="primary"
              >
                {disabledButtonRequestImportCSV ? (
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
                  "Requests"
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* END: Modal Import CSV */}

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
              <Textarea name="Username" value={form?.Username} disabled />
              <p className="text-xs text-blue-500">
                Example: LIN.OPR.ROOT;ORA.OPR.SYS.EVDB;...
              </p>
            </div>

            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <Textarea name="Address" value={form?.Address} disabled />
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
                  "Requests"
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
