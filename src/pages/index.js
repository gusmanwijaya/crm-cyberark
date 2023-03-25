/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input } from "react-daisyui";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

import HeadComponent from "@/components/HeadComponent";
import FooterComponent from "@/components/FooterComponent";
import GapComponent from "@/components/GapComponent";

import { signIn } from "@/services/auth";

const SignIn = () => {
  const router = useRouter();

  const [disabledButton, setDisabledButton] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSignIn = async () => {
    setDisabledButton(true);
    if (form?.username !== "" && form?.password !== "") {
      const response = await signIn(form);
      if (response?.data?.statusCode === 200) {
        Cookies.set("tkn", response?.data?.data);
        router.push("/dashboard");
        setDisabledButton(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Kredensial Anda tidak valid.",
          text: response?.data?.message,
        });
        setDisabledButton(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Silahkan isi username dan password Anda.",
      });
      setDisabledButton(false);
    }
  };

  return (
    <>
      <HeadComponent />

      <div className="w-screen h-screen">
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div>
              <img
                className="mx-auto h-16 w-auto"
                src="/bank-mandiri.png"
                alt="Bank Mandiri"
              />
            </div>

            <GapComponent height={10} />

            <div className="flex flex-col w-full component-preview p-4 items-center justify-center gap-2">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <Input
                  name="username"
                  type="text"
                  onChange={(event) =>
                    setForm({ ...form, username: event?.target?.value })
                  }
                  required
                />
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <Input
                  name="password"
                  type="password"
                  onChange={(event) =>
                    setForm({ ...form, password: event?.target?.value })
                  }
                  required
                />
              </div>

              <GapComponent height={10} />

              <div className="form-control w-full max-w-xs">
                <Button
                  onClick={handleSignIn}
                  className={`capitalize text-white ${
                    disabledButton && "cursor-not-allowed"
                  }`}
                  disabled={disabledButton}
                  color="accent"
                >
                  {disabledButton ? (
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
                    "Masuk"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
};

export default SignIn;

export async function getServerSideProps({ req }) {
  const { tkn } = req.cookies;
  if (tkn)
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };

  return {
    props: {},
  };
}
