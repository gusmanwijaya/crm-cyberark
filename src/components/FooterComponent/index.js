import React from "react";

const FooterComponent = () => {
  return (
    <footer className="w-full h-full p-4 pt-0 mx-0 pb-6 md:mx-2 flex justify-center items-center">
      <span className="block text-sm text-slate-500 text-center">
        Copyright © {new Date().getFullYear()} Channel Release Management - PT
        Bank Mandiri (Persero) Tbk
      </span>
    </footer>
  );
};

export default FooterComponent;
