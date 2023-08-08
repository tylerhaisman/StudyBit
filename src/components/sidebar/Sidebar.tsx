import "./style.css";
import Image from "next/image";
import Logo from "../../../public/assets/icons/logo.svg";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import SidebarLeft from "../../../public/assets/icons/sidebarLeft.svg";
import SidebarRight from "../../../public/assets/icons/sidebarRight.svg";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const path = usePathname();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const sidebarValue = localStorage.getItem("toggleSidebar");
  const [width, setWidth] = useState(window.innerWidth);
  const router = useRouter();

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
      style={{
        minWidth: width >= 900 && toggleSidebar ? "320px" : "0",
      }}
    >
      {path != "/" && !toggleSidebar && (
        <div
          className="showSidebar false"
          onClick={() => setToggleSidebar(!toggleSidebar)}
        >
          <Image
            src={SidebarRight}
            alt="Menu toggle"
            width={25}
            height={25}
          ></Image>
        </div>
      )}
      {toggleSidebar && (
        <div className="sidebarContent">
          <div className="logoAndToggle">
            <div className="logo" onClick={() => router.push("/console")}>
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
                src={SidebarLeft}
                alt="Menu toggle"
                width={25}
                height={25}
              ></Image>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
