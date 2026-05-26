import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { pool } from "../../db";
import config from "../../config";
import type { TUser } from "./auth.interface";

// signup user
export const signupUserIntoDB = async (payload: TUser) => {
  const { name, email, password, role } = payload;
  // hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  // insert user
  const result = await pool.query(
    `
      INSERT INTO users(
        name,
        email,
        password,
        role
      )
      VALUES($1,$2,$3,$4)

      RETURNING
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    `,
    [name, email, hashedPassword, role],
  );
  return result.rows[0];
};

// login user
export const loginUserFromDB = async (payload: TUser) => {
  const { email, password } = payload;
  // find user
  const result = await pool.query(
    `
      SELECT * FROM users
      WHERE email=$1
    `,
    [email],
  );
  const user = result.rows[0];
  // user not found
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  // compare password
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    const error: any = new Error("Password or email does not match");
    error.statusCode = 400;
    throw error;
  }

  // generate token
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    config.jwt_access_secret,
    {
      expiresIn: "365d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};
