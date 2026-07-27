import { prisma } from "../../config/prisma.js";

export async function createCategory(name: string) {
  return prisma.category.create({
    data: {
      name,
    },
  });
}

export async function findCategoryByName(name: string) {
  return prisma.category.findUnique({
    where: {
      name,
    },
  });
}

export async function findCategoryById(id: number) {
  return prisma.category.findUnique({
    where: {
      id,
    },
  });
}

export async function findAllCategories() {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateCategory(
  id: number,
  name: string
) {
  return prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({
    where: {
      id,
    },
  });
}