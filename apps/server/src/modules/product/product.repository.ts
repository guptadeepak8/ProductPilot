import { prisma } from "../../config/prisma.js";

import type { CreateProductInput } from "./product.schema.js";

export async function createProduct(data: CreateProductInput) {
  return prisma.product.create({
    data,
    include: {
      category: true,
    },
  });
}

export async function findProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
}

export async function updateProduct(
  id: number,
  data: Partial<CreateProductInput>
) {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({
    where: { id },
  });
}

export async function findProducts(
  page: number,
  limit: number,
  search?: string,
  sort: "asc" | "desc" = "asc"
) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            category: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        price: sort,
      },
      include: {
        category: true,
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findAllProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function bulkCreateProducts(
  products: CreateProductInput[]
) {
  return prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
}

export async function findCategories() {

  return prisma.category.findMany({

    select: {

      id: true,

      name: true,

    },

  });

}