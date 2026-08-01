import { beforeEach, describe, expect, it, vi } from "vitest";

const prisma = vi.hoisted(() => ({
  product: {
    count: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock("../../config/prisma.js", () => ({ prisma }));

describe("product repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds search, pagination, and price sorting query options", async () => {
    const { findProducts } = await import("./product.repository.js");
    prisma.product.findMany.mockResolvedValue([]);
    prisma.product.count.mockResolvedValue(12);

    const result = await findProducts(2, 5, "phone", "desc");

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: "phone", mode: "insensitive" } },
          { category: { name: { contains: "phone", mode: "insensitive" } } },
        ],
      },
      skip: 5,
      take: 5,
      orderBy: { price: "desc" },
      include: { category: true },
    });
    expect(result.pagination).toEqual({ page: 2, limit: 5, total: 12, totalPages: 3 });
  });
});
