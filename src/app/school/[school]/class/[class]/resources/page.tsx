"use client";

import "./style.css";
import Nav from "@/components/nav/Nav";
import Sidebar from "@/components/sidebar/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader/Loader";
import Image from "next/image";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

const Resources = () => {
  const path = usePathname();
  const [className, setClassName] = useState("");
  const [school, setSchool] = useState("");
  const [allClasses, setAllClasses] = useState<Array<allClassesInterface>>([]);
  const [currentClass, setCurrentClass] = useState<allClassesInterface>();
  const [roomName, setRoomName] = useState("");
  const [userId, setUserId] = useState("");
  interface allClassesInterface {
    title: string;
    code: string;
    documents: JSON;
    school: string;
  }

  useEffect(() => {
    const endpoint = path.substring(8);
    console.log(endpoint);
    const indexClass = endpoint.indexOf("/class/");
    const nameSchool = decodeURIComponent(endpoint.substring(0, indexClass));
    setSchool(nameSchool);
    const indexEndClass = endpoint.indexOf("/resources");
    setRoomName(endpoint.substring(0, indexEndClass));
    const nameClass = decodeURIComponent(
      endpoint.substring(indexClass + 7, indexEndClass)
    );
    setClassName(nameClass);
  }, []);

  const getAllClasses = async () => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "getAllClasses",
        }),
      });
      const data = await response.json();
      if (data.message == "Error retrieving classes.") {
        return;
      }
      return data.message;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getUserByEmail = async () => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "findUserByEmail",
          email: session?.user?.email,
        }),
      });
      const data = await response.json();
      if (data.message == "Error retrieving username.") {
        return;
      }
      return data.message;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      if (session) {
        const classes = await getAllClasses();
        setAllClasses(classes);

        const foundClass = classes.find(
          (classItem: allClassesInterface) =>
            classItem.title === className && classItem.school == school
        );

        if (foundClass) {
          setCurrentClass(foundClass);
        } else {
          console.error(`Class with title "${className}" not found.`);
        }

        const user = await getUserByEmail();
        setUserId(user.id);
      }
    };
    if (status === "authenticated") {
      fetch();
    }
  }, [session, status, className]);
  if (status === "loading") {
    return <Loader></Loader>;
  }
  if (status === "unauthenticated") {
    router.push("/auth");
    return;
  }
  return (
    <div className="resources">
      <Nav></Nav>
      <div className="page">
        <Sidebar></Sidebar>
        <div className="data">
          <h2>{className}</h2>
          <p>{currentClass?.code}</p>
          <div className="pageInfo">
            <p className="pageInfoTitle">Resources</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
