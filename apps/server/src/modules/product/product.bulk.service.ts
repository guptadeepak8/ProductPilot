import fs from "node:fs";
import csv from "csv-parser";

import * as productRepository from "./product.repository.js";

import type { CreateProductInput } from "./product.schema.js";

export async function bulkUploadProducts(
  filePath: string
): Promise<number> {
  return new Promise((resolve, reject) => {
    const products: CreateProductInput[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        products.push({
          name: row.name,
          price: Number(row.price),
          categoryId: Number(row.categoryId),
          image: null,
        });
      })
      .on("end", async () => {
        try {
          const result =
            await productRepository.bulkCreateProducts(products);

          fs.unlinkSync(filePath);

          resolve(result.count);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });
}