import { beforeEach, describe, expect, it, vi } from "vitest";

const productRepository = vi.hoisted(() => ({
  findAllProducts: vi.fn(),
}));

vi.mock("./product.repository.js", () => productRepository);

describe("product reports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates a workbook with headers and product rows", async () => {
    const { generateProductReport } = await import("./product.report.service.js");
    productRepository.findAllProducts.mockResolvedValue([
      {
        id: 1,
        name: "Keyboard",
        price: 1200,
        image: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        category: { name: "Electronics" },
      },
    ]);

    const workbook = await generateProductReport();
    const worksheet = workbook.getWorksheet("Products")!;

    expect(workbook.creator).toBe("ProductPilot");
    expect(worksheet.getRow(1).values).toEqual([
      undefined,
      "ID",
      "Product",
      "Category",
      "Price",
      "Image URL",
      "Created At",
    ]);
    expect(worksheet.getRow(2).values).toEqual([
      undefined,
      1,
      "Keyboard",
      "Electronics",
      1200,
      "",
      new Date("2026-01-01T00:00:00.000Z"),
    ]);
  }, 30_000);
});
