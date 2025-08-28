
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
  type: string;
}

export function signToken(payload: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

