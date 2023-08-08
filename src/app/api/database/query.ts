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
  school: string
) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    await client.query(
      `INSERT INTO classes (title, code, documents, school) VALUES ($1, $2, $3, $4)`,
      [className, classCode, "[]", school]
    );
    return "Success";
  } catch (error) {
    return error;
  }
}
