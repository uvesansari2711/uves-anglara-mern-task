import { Router } from "express";
import {
  createCategory,
  getCategoriesTree,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect } from "../middleware/auth";

const router = Router();

// All category routes are protected
router.post("/", protect, createCategory);
router.get("/", protect, getCategoriesTree);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
