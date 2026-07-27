import { AppError } from "../../utils/AppError.js";

import {
  createCategory,
  deleteCategory,
  findAllCategories,
  findCategoryById,
  findCategoryByName,
  updateCategory,
} from "./category.repository.js";

export async function createCategoryService(name: string) {
  const existingCategory = await findCategoryByName(name);

  if (existingCategory) {
    throw new AppError(409, "Category already exists");
  }

  return createCategory(name);
}

export async function getAllCategoriesService() {
  return findAllCategories();
}

export async function getCategoryByIdService(id: number) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
}

export async function updateCategoryService(
  id: number,
  name: string
) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const existing = await findCategoryByName(name);

  if (existing && existing.id !== id) {
    throw new AppError(409, "Category already exists");
  }

  return updateCategory(id, name);
}

export async function deleteCategoryService(id: number) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  await deleteCategory(id);
}