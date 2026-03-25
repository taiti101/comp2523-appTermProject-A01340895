import { eq } from "drizzle-orm";
import type { DbClient } from "#/dal/db/client";
import { usersTable } from "#/dal/db/schema";
import type { AuthResponse, SigninInput, SignupInput } from "#/types";

export class AuthService {
  constructor(private readonly db: DbClient) {}

  async signup(input: SignupInput): Promise<AuthResponse> {
    const fullName = input.fullName.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();

    if (!fullName || !email || !password) {
      throw new Error("All fields are required.");
    }

    const existingUser = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const [newUser] = await this.db
      .insert(usersTable)
      .values({
        fullName,
        email,
        password,
      })
      .returning({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
      });

    if (!newUser) {
      throw new Error("Failed to create account.");
    }

    return { user: newUser };
  }

  async signin(input: SigninInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const user = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (!user || user.password !== password) {
      throw new Error("Invalid email or password.");
    }

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
}