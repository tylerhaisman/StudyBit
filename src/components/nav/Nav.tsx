"use client";

import { useState, useEffect } from "react";
import "./style.css";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Logo from "../../../public/assets/icons/logo.svg";
import Arrow from "../../../public/assets/icons/arrow.svg";
import { useRouter, usePathname } from "next/navigation";
import Hamburger from "../../../public/assets/icons/hamburger.svg";
import Profile from "../../../public/assets/icons/profile.svg";

const Nav = () => {
  const router = useRouter();
  const path = usePathname();

  const handleSidebarToggle = () => {
    if (localStorage.getItem("toggleSidebar") == "true") {
      localStorage.setItem("toggleSidebar", "false");
    } else {
      localStorage.setItem("toggleSidebar", "true");
    }
  };

  return (
    <div
      className="nav"
      style={{
        background:
          path === "/" || path === "/auth" ? "transparent" : "#ffffff99",
        borderBottom:
          path === "/" || path === "/auth" ? "0" : "1px solid #a3a3a354",
        position: path === "/" || path === "/auth" ? "relative" : "fixed",
      }}
    >
      {path != "/" && path != "/auth" && (
        <div className="showSidebar" onClick={handleSidebarToggle}>
          <Image
            src={Hamburger}
            alt="Menu toggle"
            width={30}
            height={30}
          ></Image>
        </div>
      )}
      <div className="logo">
        <Image src={Logo} alt="StudyBit logo" width={30} height={30}></Image>
        StudyBit
      </div>
      {path != "/" && path != "/auth" && (
        <div className="showProfile" onClick={() => signOut()}>
          <Image
            src={Profile}
            alt="View profile"
            width={20}
            height={20}
          ></Image>
        </div>
      )}
      {path == "/" && (
        <div className="goToConsole">
          <button onClick={() => router.push("/console")}>
            Go To Console{" "}
            <Image
              src={Arrow}
              alt="Arrow up right"
              width={16}
              height={16}
            ></Image>
          </button>
        </div>
      )}
    </div>
  );
};

export default Nav;
