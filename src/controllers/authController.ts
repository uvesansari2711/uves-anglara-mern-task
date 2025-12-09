import { Request, Response } from "express";
import { User } from "../models/User";
import { comparePassword, hashPassword } from "../utils/password";
import { generateJwtToken } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";

// #region register user
export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already registered" });

  // Hash password before saving
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });

  // Generate JWT token with user id as payload
  const token = generateJwtToken({ id: user._id.toString() });
  return res.status(201).json({
    message: "User registered successfully",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});
//#endregion

// #region login user
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // Check password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Generate JWT token with user id as payload
  const token = generateJwtToken({ id: user._id.toString() });

  res.json({
    message: "Login successful",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});
//#endregion
