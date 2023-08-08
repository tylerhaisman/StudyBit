import "./style.css";
import Image from "next/image";
import Logo from "../../../public/assets/icons/logo.svg";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Hamburger from "../../../public/assets/icons/hamburger.svg";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const path = usePathname();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const sidebarValue = localStorage.getItem("toggleSidebar");
  const [width, setWidth] = useState(window.innerWidth);

  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    if (width >= 900) {
      setToggleSidebar(true);
    } else {
      setToggleSidebar(false);
    }

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div
      className="sidebar"
      style={{ position: width >= 900 ? "relative" : "fixed" }}
    >
      {path != "/" && !toggleSidebar && (
        <div
          className="showSidebar false"
          onClick={() => setToggleSidebar(!toggleSidebar)}
        >
          <Image
            src={Hamburger}
            alt="Menu toggle"
            width={35}
            height={35}
          ></Image>
        </div>
      )}
      {toggleSidebar && (
        <div className="sidebarContent large">
          <div className="logoAndToggle">
            <div className="logo">
              <Image
                src={Logo}
                alt="StudyBit logo"
                width={30}
                height={30}
              ></Image>{" "}
              StudyBit
            </div>
            <div
              className="showSidebar true"
              onClick={() => setToggleSidebar(!toggleSidebar)}
            >
              <Image
                src={Hamburger}
                alt="Menu toggle"
                width={35}
                height={35}
              ></Image>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
