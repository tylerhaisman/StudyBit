"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Nav from "@/components/nav/Nav";
import Image from "next/image";
import Arrow from "../../../public/assets/icons/arrow.svg";
import Link from "next/link";
import "./style.css";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";

const Auth = () => {
  const [authType, setAuthType] = useState("");

  useEffect(() => {
    setAuthType("login");
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const loginEmail = useRef("");
  const loginPassword = useRef("");

  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loginEmail.current.length > 0 && loginPassword.current.length > 0) {
      const response = await userSignIn(
        loginEmail.current,
        loginPassword.current
      );
      if (response.message == "No user found! Please sign up.") {
        toast.error(response.message);
        return;
      } else if (response.message == "Incorrect password.") {
        toast.error(response.message);
        return;
      }
      toast.loading("Signing you in...");
      const result = await signIn("credentials", {
        email: loginEmail.current,
        password: loginPassword.current,
        callbackUrl: "/console",
      });
      if (result?.error) {
        toast.error("Username or password is incorrect.");
      } else {
        router.push("/console");
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  const userSignIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "userSignIn",
          email,
          password,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const registerEmail = useRef("");
  const registerPassword = useRef("");
  const registerFirstName = useRef("");
  const registerLastName = useRef("");
  const [selectedSchool, setSelectedSchool] = useState("Choose One");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (
      registerEmail.current.length > 0 &&
      registerPassword.current.length > 0 &&
      registerFirstName.current.length > 0 &&
      registerLastName.current.length > 0 &&
      selectedSchool !== "Choose One"
    ) {
      const response = await addUser();
      if (response.message == "User already exists! Please sign in.") {
        toast.error(response.message);
        return;
      } else if (
        response.message ==
        "Username is already in use. Please choose another username."
      ) {
        toast.error(response.message);
        return;
      }
      const signin = await userSignIn(
        registerEmail.current,
        registerPassword.current
      );
      if (
        signin.message == "No user found! Please sign up." ||
        signin.message == "Incorrect password."
      ) {
        toast.error("An error occured.");
        return;
      }
      toast.loading("Signing you in...");
      const result = await signIn("credentials", {
        email: registerEmail.current,
        password: registerPassword.current,
        callbackUrl: "/console",
      });
      if (result?.error) {
        toast.error("An error occured.");
      } else {
        router.push("/console");
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "addUser",
          email: registerEmail.current,
          password: registerPassword.current,
          firstName: registerFirstName.current,
          lastName: registerLastName.current,
          school: selectedSchool,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  if (!mounted) return <></>;

  return (
    <div className="auth">
      <Toaster></Toaster>
      <div className="content">
        <Nav></Nav>
      </div>
      {authType == "login" && (
        <div className="authType">
          <div className="content">
            <form action="" onSubmit={async (e) => await handleLogin(e)}>
              <h1>Sign In</h1>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => (loginEmail.current = e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => (loginPassword.current = e.target.value)}
              />
              <Link href="">Forgot your password?</Link>
              <button>
                Sign In <Image src={Arrow} alt="Arrow up right"></Image>
              </button>
              <p>
                Need to register?{" "}
                <Link href="" onClick={() => setAuthType("register")}>
                  Register here.
                </Link>
              </p>
            </form>
          </div>
        </div>
      )}
      {authType == "register" && (
        <div className="authType">
          <div className="content">
            <form action="" onSubmit={async (e) => await handleRegister(e)}>
              <h1>Register</h1>
              <input
                type="text"
                placeholder="First Name"
                onChange={(e) => (registerFirstName.current = e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                onChange={(e) => (registerLastName.current = e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => (registerEmail.current = e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => (registerPassword.current = e.target.value)}
              />
              <select
                name=""
                id=""
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                style={{
                  color: selectedSchool == "Choose One" ? "#777777" : "#111111",
                }}
              >
                <option value="Choose One">Choose One</option>
                <option value="University of Florida">
                  University of Florida
                </option>
              </select>
              <button>
                Register <Image src={Arrow} alt="Arrow up right"></Image>
              </button>
              <p>
                Need to sign in?{" "}
                <Link href="" onClick={() => setAuthType("login")}>
                  Sign in here.
                </Link>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
