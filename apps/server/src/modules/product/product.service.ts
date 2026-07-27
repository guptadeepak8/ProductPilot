import { AppError } from "../../utils/AppError.js";

import * as categoryRepository from "../category/category.repository.js";
import * as productRepository from "./product.repository.js";

import type { CreateProductInput } from "./product.schema.js";

export async function createProductService(
  data: CreateProductInput
) {
  const category = await categoryRepository.findCategoryById(
    data.categoryId
  );

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return productRepository.createProduct(data);
}

export async function getProductsService(
  page: number,
  limit: number,
  search?: string,
  sort: "asc" | "desc" = "asc"
) {
  return productRepository.findProducts(
    page,
    limit,
    search,
    sort
  );
}

export async function getProductByIdService(
  id: number
) {
  const product = await productRepository.findProductById(id);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  return product;
}

export async function updateProductService(
  id: number,
  data: Partial<CreateProductInput>
) {
  const product = await productRepository.findProductById(id);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  if (data.categoryId !== undefined) {
    const category =
      await categoryRepository.findCategoryById(
        data.categoryId
      );

    if (!category) {
      throw new AppError(404, "Category not found");
    }
  }

  return productRepository.updateProduct(
    id,
    data
  );
}

export async function deleteProductService(
  id: number
) {
  const product = await productRepository.findProductById(id);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  await productRepository.deleteProduct(id);

  return;
}