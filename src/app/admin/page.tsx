"use client";

import Nav from "@/components/nav/Nav";
import { useState, useEffect, FormEvent } from "react";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";

const Admin = () => {
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [resource, setResource] = useState("");
  const [school, setSchool] = useState("");

  const router = useRouter();

  const addClass = async (event: FormEvent) => {
    event.preventDefault();
    if (className != "" && classCode != "" && school != "") {
      const getRoomName =
        "/school/" +
        encodeURIComponent(school) +
        "/class/" +
        encodeURIComponent(className);
      const roomName = getRoomName.substring(8);
      try {
        const response = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "addClass",
            className,
            classCode,
            school,
            roomName,
          }),
        });
        const data = await response.json();
        if (data.message == "Error adding class") {
          return;
        }
        toast.success("Class added.");
        return data.message;
      } catch (error) {
        toast.error("Class not added.");
        console.error(error);
        throw error;
      }
    }
  };
  const addResource = async (event: FormEvent) => {
    event.preventDefault();
    if (classCode != "" && resource != "" && school != "") {
      try {
        const response = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "addResource",
            classCode,
            resource,
            school,
          }),
        });
        const data = await response.json();
        if (data.message == "Error adding resource") {
          return;
        }
        toast.success("Class added.");
        return data.message;
      } catch (error) {
        toast.error("Class not added.");
        console.error(error);
        throw error;
      }
    }
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetch = async () => {
      if (session) {
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
    <div className="admin">
      <Toaster></Toaster>
      <form action="" onSubmit={(e) => addClass(e)}>
        <h2>Add class</h2>
        <input
          type="text"
          placeholder="School"
          onChange={(e) => setSchool(e.target.value)}
        />
        <input
          type="text"
          placeholder="Class Code"
          onChange={(e) => setClassCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Class Name"
          onChange={(e) => setClassName(e.target.value)}
        />
        <button>Add class</button>
      </form>
      <form action="" onSubmit={(e) => addResource(e)}>
        <h2>Add resource</h2>
        <input
          type="text"
          placeholder="School"
          onChange={(e) => setSchool(e.target.value)}
        />
        <input
          type="text"
          placeholder="Class code"
          onChange={(e) => setClassCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Resource"
          onChange={(e) => setResource(e.target.value)}
        />
        <button>Add resource</button>
      </form>
    </div>
  );
};

export default Admin;
