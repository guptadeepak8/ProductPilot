import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const productRepository = vi.hoisted(() => ({
  bulkCreateProducts: vi.fn(),
  findCategories: vi.fn(),
}));

vi.mock("./product.repository.js", () => productRepository);

describe("bulk upload products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("imports valid rows, skips invalid rows, and returns a summary", async () => {
    const { bulkUploadProducts } = await import("./product.bulk.service.js");
    productRepository.findCategories.mockResolvedValue([{ id: 1, name: "Electronics" }]);
    productRepository.bulkCreateProducts.mockResolvedValue({ count: 1 });
    const filePath = path.join(os.tmpdir(), `products-${Date.now()}.csv`);
    await fs.writeFile(
      filePath,
      [
        "name,price,category,image",
        "Keyboard,1200,Electronics,https://example.com/keyboard.png",
        "Novel,300,Books,",
        "Mouse,not-a-number,Electronics,",
      ].join("\n")
    );

    const result = await bulkUploadProducts(filePath);

    expect(productRepository.bulkCreateProducts).toHaveBeenCalledWith([
      {
        name: "Keyboard",
        price: 1200,
        categoryId: 1,
        image: "https://example.com/keyboard.png",
      },
    ]);
    expect(result).toEqual({
      imported: 1,
      skipped: 2,
      errors: [
        { row: 3, reason: "Category 'Books' not found" },
        { row: 4, reason: "Invalid price" },
      ],
    });
  });
});
