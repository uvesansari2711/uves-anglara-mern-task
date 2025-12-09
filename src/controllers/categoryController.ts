import { Request, Response } from "express";
import { Types } from "mongoose";
import { Category, ICategory } from "../models/Category";
import { catchAsync } from "../utils/catchAsync";
import { buildCategoryTree } from "../utils/buildCategoryTree";

/**
 * Get all descendant category IDs (children, grandchildren, etc.) using an iterative BFS approach.
 */
const getDescendantIds = async (
  rootId: Types.ObjectId
): Promise<Types.ObjectId[]> => {
  const descendants: Types.ObjectId[] = [];
  const queue: Types.ObjectId[] = [rootId];

  while (queue.length) {
    const current = queue.shift()!;
    const children = await Category.find({ parent: current }, "_id");
    for (const child of children) {
      const childId = child._id as Types.ObjectId;
      descendants.push(childId);
      queue.push(childId);
    }
  }

  return descendants;
};

// #region create category
export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { name, parentId, status } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    // If parentId is provided, validate that it exists
    let parent = null;
    if (parentId) {
      parent = await Category.findById(parentId);
      if (!parent) {
        return res.status(400).json({ message: "Invalid parentId" });
      }
    }

    const category = await Category.create({
      name,
      parent: parent ? parent._id : null,
      status: status || "active",
    });

    return res
      .status(201)
      .json({ message: "Category created successfully", data: category });
  }
);
// #endregion

// #region get categories tree
export const getCategoriesTree = catchAsync(
  async (req: Request, res: Response) => {
    // Fetch all categories once and build nested tree
    const categories = await Category.find().lean<ICategory[]>();
    const tree = buildCategoryTree(categories);
    return res
      .status(200)
      .json({ message: "Categories fetched successfully", data: tree });
  }
);
// #endregion

// #region update category
export const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, status } = req.body;

    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Update name if provided
    if (name) category.name = name;

    // If status is changing, handle cascade
    if (status && status !== category.status) {
      category.status = status;

      // If status is set to inactive, cascade to all descendants
      if (status === "inactive") {
        const rootId = category._id as Types.ObjectId;
        const descendants = await getDescendantIds(rootId);
        if (descendants.length) {
          await Category.updateMany(
            { _id: { $in: descendants } },
            { $set: { status: "inactive" } }
          );
        }
      }
    }

    await category.save();
    return res
      .status(200)
      .json({ message: "Category updated successfully", data: category });
  }
);
//#endregion

// #region delete category
export const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // If this category has a parent, we reassign its children to that parent.
    // If not (this is a root), the children become root-level categories.
    const parentId = category.parent
      ? (category.parent as Types.ObjectId)
      : null;

    await Category.updateMany(
      { parent: category._id },
      { $set: { parent: parentId } }
    );

    await Category.deleteOne({ _id: category._id });

    return res
      .status(200)
      .json({ message: "Category deleted and children reassigned" });
  }
);
// #endregion
