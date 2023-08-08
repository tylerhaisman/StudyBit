"use client";

import "./style.css";
import Nav from "@/components/nav/Nav";
import Sidebar from "@/components/sidebar/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader/Loader";

const LiveNote = () => {
  const path = usePathname();
  const [className, setClassName] = useState("");
  const [school, setSchool] = useState("");
  const [allClasses, setAllClasses] = useState<Array<allClassesInterface>>([]);
  const [currentClass, setCurrentClass] = useState<allClassesInterface>();
  interface allClassesInterface {
    title: string;
    code: string;
    documents: JSON;
    school: string;
  }

  useEffect(() => {
    const endpoint = path.substring(8);
    const indexClass = endpoint.indexOf("/class/");
    const nameSchool = decodeURIComponent(endpoint.substring(0, indexClass));
    setSchool(nameSchool);
    const indexEndClass = endpoint.indexOf("/livenote");
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
    <div className="liveNote">
      <Nav></Nav>
      <div className="page">
        <Sidebar></Sidebar>
        <div className="data">
          <div className="liveNoteBadge">
            <div className="indicator"></div> Live Note
          </div>
          <h2>{className}</h2>
          <p>{currentClass?.code}</p>
          <div className="wordProcessor"></div>
        </div>
      </div>
    </div>
  );
};

export default LiveNote;
