import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Dropdown, Menu, Navbar } from "react-daisyui";

const NavbarComponent = () => {
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <div className="flex w-full component-preview p-4 items-center justify-center gap-2">
      <Navbar>
        <Navbar.Start>
          <Dropdown open={visible} onClick={toggleVisible}>
            <Button color="ghost" tabIndex={0} className="lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </Button>
            {/* START: Menu Mobile */}
            <Dropdown.Menu
              tabIndex={0}
              className={`w-52 menu-compact mt-3 ${!visible && "hidden"}`}
            >
              <Dropdown.Item>
                <p onClick={() => router.push(`/my-request`)}>My Request</p>
              </Dropdown.Item>
              <li tabIndex={0}>
                <div className="justify-between">
                  Pengaturan
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </div>
                <ul className="p-2 bg-base-100">
                  <li>
                    <p onClick={() => router.push(`/ganti-password`)}>
                      Ganti Password
                    </p>
                  </li>
                  <li>
                    <p>Keluar</p>
                  </li>
                </ul>
              </li>
            </Dropdown.Menu>
            {/* END: Menu Mobile */}
          </Dropdown>
          <div
            onClick={() => router.push(`/`)}
            className="btn btn-ghost normal-case text-xl"
          >
            CRM - Cyberark
          </div>
        </Navbar.Start>
        {/* START: Menu Desktop */}
        <Navbar.Center className="hidden lg:flex">
          <Menu horizontal className="p-0">
            <Menu.Item>
              <p onClick={() => router.push(`/my-request`)}>My Request</p>
            </Menu.Item>
            <Menu.Item tabIndex={0}>
              <div>
                Pengaturan
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </div>
              <Menu className="p-2 bg-base-100 lg:z-10 rounded-lg">
                <Menu.Item>
                  <p onClick={() => router.push(`/ganti-password`)}>
                    Ganti Password
                  </p>
                </Menu.Item>
                <Menu.Item>
                  <p>Keluar</p>
                </Menu.Item>
              </Menu>
            </Menu.Item>
          </Menu>
        </Navbar.Center>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
