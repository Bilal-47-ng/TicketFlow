import type { LoginUser, RegisteredUser } from "../types/user.js";
import argon2 from "argon2";
import { pool } from "../config/db.js";
import { AppError } from "../errors/AppError.js";

type PostgresError = Error & {
  code?: string;
  constraint?: string;
};

export async function registerUser(
  password: string,
  email: string,
): Promise<RegisteredUser> {
  const normalizedEmail = email.trim().toLocaleLowerCase();
  const passwordHash = await argon2.hash(password);

  try {
    const result = await pool.query<RegisteredUser>(
      `
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            
            returning id, email, created_at
            `,
      [normalizedEmail, passwordHash],
    );

    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      const dbError = error as PostgresError;

      if (
        dbError.code === "23505" &&
        dbError.constraint === "users_email_key"
      ) {
        throw new AppError(409, "Email already exists");
      }
    }
    throw error;
  }
}

type LoginUserQuery = LoginUser & { password_hash: string | null };

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginUser> {
  const normalizedEmail = email.trim().toLocaleLowerCase();
  const result = await pool.query<LoginUserQuery>(
    `
    SELECT id, email, password_hash, created_at
    FROM users
    WHERE email = $1
    `,
    [normalizedEmail],
  );

  const user = result.rows[0];
  if (!user || !user.password_hash) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await argon2.verify(user.password_hash, password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  };
}

export async function getUserById(id: string): Promise<LoginUser> {
  const result = await pool.query<LoginUser>(
    `
    SELECT id, email, created_at
    FROM users
    WHERE id = $1
    `,
    [id],
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
}
