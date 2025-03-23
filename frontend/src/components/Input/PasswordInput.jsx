import React, { useState } from "react";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function PasswordInput({password, onChange, placeholder}) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3 ">
      <input
        type={showPass ? "text" : "password"}
        value={password}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-full text-sm py-3 mr-3 bg-transparent rounded outline-none"
      />

      {showPass ? (
        <FaRegEye
          size={22}
          className="text-primary cursor-pointer"
          onClick={() => setShowPass(!showPass)}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-primary cursor-pointer"
          onClick={() => setShowPass(!showPass)}
        />
      )}
    </div>
  );
}
