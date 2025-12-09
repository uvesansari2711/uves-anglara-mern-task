import jwt from "jsonwebtoken";

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export const generateJwtToken = (payload: object) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES_IN  as jwt.SignOptions["expiresIn"],
  });
};
