import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface JwtPayload {
  id: string;
}

// Middleware to protect routes - verifies JWT and attaches user to request
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token and extract user ID
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not configured");

    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found with the provided auth token" });

    // Attach user to request object for next middleware/controllers
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
