import { json } from "stream/consumers";
import Database from "./connection";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
import User from "./models/user";

export async function findFullUser(email: string) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (response.rows.length > 0) {
      return response.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function userSignIn(email: string, password: string) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (response.rows.length > 0) {
      const isPasswordValid = bcrypt.compareSync(
        password,
        response.rows[0].password
      );
      if (isPasswordValid) {
        return response.rows[0];
      } else {
        return "Incorrect password";
      }
    } else {
      return "No user found";
    }
  } catch (error) {
    return error;
  }
}

export async function addUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  school: string
) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const emails = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (emails.rows.length > 0) {
      return "User already exists";
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv4();

    const newUser = new User({
      id: uuid,
      email,
      password: encryptedPassword,
      firstName,
      lastName,
      school,
      isAdmin: false,
    });

    const values = [
      newUser.id,
      newUser.email,
      newUser.password,
      newUser.firstName,
      newUser.lastName,
      newUser.school,
      newUser.isAdmin,
    ];

    await client.query(
      "INSERT INTO users (id, email, password, firstName, lastName, school, isAdmin) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      values
    );
    return "Success";
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(
      `SELECT firstName, lastName, email, school, classes, isAdmin FROM users WHERE email = $1`,
      [email]
    );
    if (response.rows.length > 0) {
      return response.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function getAllClasses() {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(`SELECT * FROM classes`);
    if (response.rows.length > 0) {
      return response.rows;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function addClass(
  className: string,
  classCode: string,
  school: string,
  roomName: string
) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    await client.query(
      `INSERT INTO classes (title, code, documents, school, roomname, livenote) VALUES ($1, $2, $3, $4, $5, $6)`,
      [className, classCode, "[]", school, roomName, "[]"]
    );
    return "Success";
  } catch (error) {
    return error;
  }
}

export async function updateNote(
  roomName: string,
  content: string,
  userID: string
) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    let existingLiveNoteContent;
    try {
      const getLiveNote = await client.query(
        `SELECT livenote FROM classes WHERE roomname = $1`,
        [roomName]
      );
      existingLiveNoteContent = getLiveNote.rows[0].livenote;
    } catch (error) {
      console.error("Error getting livenote: " + error);
      return error;
    }

    const jsonString = JSON.stringify({
      content,
    });
    await client.query(`UPDATE classes SET livenote = $1 WHERE roomname = $2`, [
      jsonString,
      roomName,
    ]);
    return "Success";
  } catch (error) {
    console.error("Error setting livenote: " + error);
    return error;
  }
}

export async function getNote(roomName: string) {
  const db = Database.getInstance();
  const client = db.getPool();
  let existingLiveNoteContent;
  try {
    const getLiveNote = await client.query(
      `SELECT livenote FROM classes WHERE roomname = $1`,
      [roomName]
    );
    if (getLiveNote) {
      existingLiveNoteContent = getLiveNote.rows[0].livenote;
      return existingLiveNoteContent;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error getting livenote: " + error);
    return error;
  }
}
