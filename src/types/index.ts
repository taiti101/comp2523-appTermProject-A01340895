import type { CommentRow, JokeRow, UserRow } from "#/dal/db/schema";

export type Joke = Pick<JokeRow, "id" | "question" | "answer" | "score"> & {
  comments: CommentRow["body"][];
};

export interface CreateJokeInput {
  question: Joke["question"];
  answer: Joke["answer"];
}

export interface VoteJokeInput {
  id: Joke["id"];
  delta: 1 | -1;
}

export interface DeleteJokeInput {
  id: Joke["id"];
}

export type AuthUser = Pick<UserRow, "id" | "fullName" | "email">;

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
}