"use client";

import "./style.css";
import Nav from "@/components/nav/Nav";
import Sidebar from "@/components/sidebar/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader/Loader";
import Image from "next/image";
import Arrow from "../../../../../../public/assets/icons/arrow.svg";
import Sparkles from "../../../../../../public/assets/icons/sparkles.svg";
import { toast, Toaster } from "react-hot-toast";

const ClassPage = () => {
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
    const nameClass = decodeURIComponent(endpoint.substring(indexClass + 7));
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
    <div className="classPage">
      <Toaster></Toaster>
      <Nav></Nav>
      <div className="page">
        <Sidebar></Sidebar>
        <div className="data">
          <h2>{className}</h2>
          <p>{currentClass?.code}</p>
          <div className="container">
            <div className="item">
              <h2>Live Note</h2>
              <p>
                Check out the Live Note for {currentClass?.code} and help your
                classmates stay up to date on the material.
              </p>
              <button
                className="special"
                onClick={() => router.push(path + "/livenote")}
              >
                <Image
                  src={Sparkles}
                  alt="Sparkles"
                  className="sparkles"
                ></Image>
                Live Note <Image src={Arrow} alt="Arrow up right"></Image>
              </button>
            </div>
            <div className="item">
              <h2>Tutoring</h2>
              <p>
                Need extra help? We can connect you with tutors who specialize
                in {currentClass?.code} at {school}!
              </p>
              <button
                className="special"
                onClick={() => toast.success("Coming soon!")}
              >
                Tutoring <Image src={Arrow} alt="Arrow up right"></Image>
              </button>
            </div>
            <div className="item">
              <h2>Study</h2>
              <p>
                Check out our flash cards, interactive activities, and other
                learning materials to enhance your understanding.
              </p>
              <button
                className="special"
                onClick={() => toast.success("Coming soon!")}
              >
                Study <Image src={Arrow} alt="Arrow up right"></Image>
              </button>
            </div>
          </div>
          <div className="container">
            <div className="item">
              <h2>Class Documents</h2>
              <p>
                View helpful class resources like study guides, practice exams,
                and other supplemental materials uploaded by your peers.
              </p>
              <button
                className="special"
                onClick={() => router.push(path + "/resources")}
              >
                Resources <Image src={Arrow} alt="Arrow up right"></Image>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
