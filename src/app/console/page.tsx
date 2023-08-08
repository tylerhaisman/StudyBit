"use client";

import "./style.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import Nav from "@/components/nav/Nav";
import Loader from "@/components/loader/Loader";
import Image from "next/image";
import Arrow from "../../../public/assets/icons/arrow.svg";
import Arrow2 from "../../../public/assets/icons/arrow2.svg";

const Console = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [school, setSchool] = useState("");
  const [allClasses, setAllClasses] = useState<Array<allClassesInterface>>([]);

  interface allClassesInterface {
    title: string;
    code: string;
    documents: JSON;
    school: string;
  }

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

  useEffect(() => {
    const fetch = async () => {
      if (session) {
        const user = await getUserByEmail();
        setFirstName(user.firstname);
        setLastName(user.lastname);
        setSchool(user.school);
        const classes = await getAllClasses();
        setAllClasses(classes);
      }
    };
    if (status === "authenticated") {
      fetch();
    }
  }, [session, status]);
  if (status === "loading") {
    return <Loader></Loader>;
  }
  if (status === "unauthenticated") {
    router.push("/auth");
    return;
  }
  return (
    <div className="console">
      <Nav></Nav>
      <div className="consolecontent">
        <Sidebar></Sidebar>
        <div className="page">
          <p>Hello {firstName},</p>
          <h2>Welcome back! 👋</h2>
          <div className="container">
            <div className="item">
              <h2>My Classes</h2>
              <ul className="classes">
                {allClasses.map((item, index) => (
                  <li key={index}>
                    {item.title}
                    <Image src={Arrow2} alt="Arrow up right"></Image>
                  </li>
                ))}
              </ul>
              <button>
                Add Classes <Image src={Arrow} alt="Arrow up right"></Image>
              </button>
            </div>
            <div className="item">
              <h2>Profile</h2>
              <p>
                {firstName} {lastName}
              </p>
              <p>{school}</p>
              <button>
                Manage Profile <Image src={Arrow} alt="Arrow up right"></Image>
              </button>
            </div>
            <div className="item">
              <h2>Notifications</h2>
            </div>
          </div>
          <div className="container">
            <div className="item">
              <h2>Live Notes</h2>
            </div>
            <div className="item">
              <h2>Recent Files</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Console;
