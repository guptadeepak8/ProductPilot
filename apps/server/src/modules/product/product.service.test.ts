import { beforeEach, describe, expect, it, vi } from "vitest";

const categoryRepository = vi.hoisted(() => ({
  findCategoryById: vi.fn(),
}));

const productRepository = vi.hoisted(() => ({
  createProduct: vi.fn(),
  deleteProduct: vi.fn(),
  findProductById: vi.fn(),
  findProducts: vi.fn(),
  updateProduct: vi.fn(),
}));

vi.mock("../category/category.repository.js", () => categoryRepository);
vi.mock("./product.repository.js", () => productRepository);

describe("product service", () => {
  const productInput = {
    name: "Keyboard",
    price: 1200,
    categoryId: 1,
    image: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a product when the category exists", async () => {
    const { createProductService } = await import("./product.service.js");
    const product = { id: 1, ...productInput };
    categoryRepository.findCategoryById.mockResolvedValue({ id: 1, name: "Electronics" });
    productRepository.createProduct.mockResolvedValue(product);

    const result = await createProductService(productInput);

    expect(productRepository.createProduct).toHaveBeenCalledWith(productInput);
    expect(result).toEqual(product);
  });

  it("updates an existing product", async () => {
    const { updateProductService } = await import("./product.service.js");
    productRepository.findProductById.mockResolvedValue({ id: 1, ...productInput });
    productRepository.updateProduct.mockResolvedValue({ id: 1, ...productInput, price: 1400 });

    const result = await updateProductService(1, { price: 1400 });

    expect(productRepository.updateProduct).toHaveBeenCalledWith(1, { price: 1400 });
    expect(result.price).toBe(1400);
  });

  it("deletes an existing product", async () => {
    const { deleteProductService } = await import("./product.service.js");
    productRepository.findProductById.mockResolvedValue({ id: 1, ...productInput });

    await deleteProductService(1);

    expect(productRepository.deleteProduct).toHaveBeenCalledWith(1);
  });

  it("passes search, pagination, and price sorting to the repository", async () => {
    const { getProductsService } = await import("./product.service.js");
    productRepository.findProducts.mockResolvedValue({
      products: [],
      pagination: { page: 2, limit: 5, total: 0, totalPages: 0 },
    });

    await getProductsService(2, 5, "keyboard", "desc");

    expect(productRepository.findProducts).toHaveBeenCalledWith(2, 5, "keyboard", "desc");
  });
});
