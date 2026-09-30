import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../db/index.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

export const registerUser = async (email, password) => {
  // Check if user exists
  const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existingUser.rows.length > 0) {
    const error = new Error("Email is already registered");
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Insert user
  const result = await pool.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, passwordHash]
  );

  const user = result.rows[0];
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return { user, token };
};

export const loginUser = async (email, password) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rows.length === 0) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const user = result.rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  delete user.password_hash;

  return { user: { id: user.id, email: user.email, created_at: user.created_at }, token };
};

export const deleteUserAccount = async (userId) => {
  await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  return { message: "Account and associated data deleted successfully" };
};
