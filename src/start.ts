import { createMiddleware, createStart } from "@tanstack/react-start";
import { JokeService } from "#/dal/JokeService";
import { AuthService } from "#/dal/db/authService";
import { dbConnection } from "#/dal/db/client";

const servicesMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const db = dbConnection();

    return next({
      context: {
        jokeService: new JokeService(db),
        authService: new AuthService(db),
      },
    });
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [servicesMiddleware],
}));