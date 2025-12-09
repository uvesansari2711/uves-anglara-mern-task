// Extend Express Request type to include `user` added by auth middleware
import "express";

declare global {
  namespace Express {
    interface Request {
      // Authenticated user info (optional)
      user?: import("../models/User").IUser;
    }
  }
}
