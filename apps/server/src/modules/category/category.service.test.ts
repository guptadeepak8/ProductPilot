import { beforeEach, describe, expect, it, vi } from "vitest";

const categoryRepository = vi.hoisted(() => ({
  createCategory: vi.fn(),
  deleteCategory: vi.fn(),
  findCategoryById: vi.fn(),
  findCategoryByName: vi.fn(),
}));

vi.mock("./category.repository.js", () => categoryRepository);

describe("category service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a category", async () => {
    const { createCategoryService } = await import("./category.service.js");
    const category = { id: 1, name: "Electronics" };
    categoryRepository.findCategoryByName.mockResolvedValue(null);
    categoryRepository.createCategory.mockResolvedValue(category);

    const result = await createCategoryService("Electronics");

    expect(categoryRepository.createCategory).toHaveBeenCalledWith("Electronics");
    expect(result).toEqual(category);
  });

  it("validates duplicate category names", async () => {
    const { createCategoryService } = await import("./category.service.js");
    categoryRepository.findCategoryByName.mockResolvedValue({ id: 1, name: "Electronics" });

    await expect(createCategoryService("Electronics")).rejects.toMatchObject({
      statusCode: 409,
      message: "Category already exists",
    });
  });

  it("deletes an existing category", async () => {
    const { deleteCategoryService } = await import("./category.service.js");
    categoryRepository.findCategoryById.mockResolvedValue({ id: 1, name: "Electronics" });

    await deleteCategoryService(1);

    expect(categoryRepository.deleteCategory).toHaveBeenCalledWith(1);
  });
});
