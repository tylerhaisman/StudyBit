import { NextResponse } from "next/server";
import {
  addUser,
  userSignIn,
  findUserByEmail,
  getAllClasses,
  addClass,
} from "./query";

export async function POST(req: Request) {
  const data = await req.json();

  if (data.action === "addUser") {
    const response = await addUser(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.school
    );
    if (response == "User already exists") {
      return NextResponse.json(
        { message: "User already exists! Please sign in." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Registration successful." },
      { status: 200 }
    );
  } else if (data.action === "userSignIn") {
    const response = await userSignIn(data.email, data.password);
    if (response == "No user found") {
      return NextResponse.json(
        { message: "No user found! Please sign up." },
        { status: 400 }
      );
    } else if (response == "Incorrect password") {
      return NextResponse.json(
        { message: "Incorrect password." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "findUserByEmail") {
    const response = await findUserByEmail(data.email);
    if (response == null) {
      return NextResponse.json(
        { message: "No user found! Please sign up." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "getAllClasses") {
    const response = await getAllClasses();
    if (response == null) {
      return NextResponse.json(
        { message: "No classes found!" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "addClass") {
    const response = await addClass(
      data.className,
      data.classCode,
      data.school
    );
    if (response == null) {
      return NextResponse.json(
        { message: "Error adding class" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Not a valid action." },
      { status: 500 }
    );
  }
}
