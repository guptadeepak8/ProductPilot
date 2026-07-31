import fs from "node:fs";
import csv from "csv-parser";

import * as productRepository from "./product.repository.js";

interface CsvProduct {
  name: string;
  price: string;
  category: string;
  image?: string;
}

interface BulkUploadResult {
  imported: number;
  skipped: number;
  errors: {
    row: number;
    reason: string;
  }[];
}

export async function bulkUploadProducts(
  filePath: string
): Promise<BulkUploadResult> {

  const categories =
    await productRepository.findCategories();

  const categoryMap =
    new Map(
      categories.map(category => [
        category.name.toLowerCase(),
        category.id,
      ])
    );

  return new Promise((resolve, reject) => {

    const products: = [];

    const errors: BulkUploadResult["errors"] = [];

    let rowNumber = 1;

    fs.createReadStream(filePath)

      .pipe(csv())

      .on("data", (row: CsvProduct) => {

        rowNumber++;

        const categoryId =
          categoryMap.get(
            row.category.trim().toLowerCase()
          );

        const price =
          Number(row.price);

        if (!row.name) {

          errors.push({
            row: rowNumber,
            reason: "Product name is required",
          });

          return;
        }

        if (Number.isNaN(price)) {

          errors.push({
            row: rowNumber,
            reason: "Invalid price",
          });

          return;
        }

        if (!categoryId) {

          errors.push({
            row: rowNumber,
            reason: `Category '${row.category}' not found`,
          });

          return;
        }

        products.push({

          name: row.name.trim(),

          price,

          categoryId,

          image: row.image || null,

        });

      })

      .on("end", async () => {

        try {

          const result =
            await productRepository.bulkCreateProducts(products);

          resolve({

            imported: result.count,

            skipped: errors.length,

            errors,

          });

        }

        catch (error) {

          reject(error);

        }

        finally {

          await fs.promises.unlink(filePath);

        }

      })

      .on("error", reject);

  });

}