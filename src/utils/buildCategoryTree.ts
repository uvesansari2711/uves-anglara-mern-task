import { ICategory } from "../models/Category";
import { Types } from "mongoose";

export interface CategoryNode {
  _id: string;
  name: string;
  status: string;
  parent: string | null;
  children: CategoryNode[];
}

// Build a nested category tree from a flat list
export const buildCategoryTree = (categories: ICategory[]): CategoryNode[] => {
  const map = new Map<string, CategoryNode>();

  // Create map for quick lookup
  categories.forEach((cat) => {
    map.set(cat._id.toString(), {
      _id: cat._id.toString(),
      name: cat.name,
      status: cat.status,
      parent: cat.parent ? (cat.parent as Types.ObjectId).toString() : null,
      children: [],
    });
  });

  const roots: CategoryNode[] = [];

  // Link children to their parent or mark as root
  map.forEach((node) => {
    if (node.parent && map.has(node.parent)) {
      map.get(node.parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};
