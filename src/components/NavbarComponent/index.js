import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Dropdown, Menu, Navbar } from "react-daisyui";

const NavbarComponent = () => {
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const handleSignOut = () => {
    Cookies.remove("tkn");
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/");
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
                <p onClick={() => router.push(`/accounts`)}>Accounts</p>
              </Dropdown.Item>
              <Dropdown.Item>
                <p onClick={() => router.push(`/my-request`)}>My Request</p>
              </Dropdown.Item>
              <Dropdown.Item>
                <p onClick={handleSignOut}>Keluar</p>
              </Dropdown.Item>
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
              <p onClick={() => router.push(`/accounts`)}>Accounts</p>
            </Menu.Item>
            <Menu.Item>
              <p onClick={() => router.push(`/my-request`)}>My Request</p>
            </Menu.Item>
            <Menu.Item>
              <p onClick={handleSignOut}>Keluar</p>
            </Menu.Item>
          </Menu>
        </Navbar.Center>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
