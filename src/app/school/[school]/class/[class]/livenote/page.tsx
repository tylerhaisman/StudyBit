"use client";

import "./style.css";
import Nav from "@/components/nav/Nav";
import Sidebar from "@/components/sidebar/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader/Loader";
import Image from "next/image";
// import ReactQuill from "react-quill";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");
import Eye from "../../../../../../../public/assets/icons/eye.svg";

const LiveNote = () => {
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
    const indexEndClass = endpoint.indexOf("/livenote");
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

  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = async (content: string) => {
    if (editorContent !== content) {
      setEditorContent(content);

      // Emit the content change to the server with room information
      socket.emit("editorChange", {
        room: roomName, // Provide the room name here
        content: content,
      });

      await updateNote(content);
    }
  };

  const updateNote = async (content: string) => {
    try {
      await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "updateNote",
          roomName,
          content,
          userId,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getNote = async () => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "getNote",
          roomName,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.message.content;
      } else {
        console.error("Error: could not get note.");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // useEffect(() => {
  //   socket.on("message", (data) => {
  //     console.log("Message received from server:", data);
  //   });

  //   socket.on("editorChange", (content) => {
  //     setEditorContent(content);
  //   });

  //   return () => {
  //     socket.off("message");
  //     socket.off("editorChange");
  //   };
  // }, []);

  useEffect(() => {
    // Join the room corresponding to the collaborative space
    socket.emit("joinRoom", roomName);

    socket.on("message", (data) => {
      console.log("Message received from server:", data);
    });

    socket.on("editorChange", (content) => {
      setEditorContent(content);
    });

    return () => {
      socket.off("message");
      socket.off("editorChange");
    };
  }, [roomName]);

  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    socket.on("viewerCountUpdate", (count) => {
      setViewerCount(count);
    });

    return () => {
      socket.off("viewerCountUpdate");
    };
  }, []);

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

        const noteContent = await getNote();
        setEditorContent(noteContent);
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
          <h2>{className}</h2>
          <p>{currentClass?.code}</p>
          <div className="pageInfo">
            <p className="pageInfoTitle">Live Note</p>
            <div className="liveNoteBadge">
              <div className="indicator"></div> Online
            </div>
            <div className="viewerCount">
              <Image src={Eye} alt="Viewers" width={20} height={20}></Image>
              <p>{viewerCount}</p>
            </div>
          </div>
          <div className="wordProcessor">
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNote;
