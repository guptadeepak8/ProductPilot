import ExcelJS from "exceljs";

import * as productRepository from "./product.repository.js";

export async function generateProductReport() {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Products");

  worksheet.columns = [
    { header: "UUID", key: "uuid", width: 40 },
    { header: "Name", key: "name", width: 30 },
    { header: "Price", key: "price", width: 15 },
    { header: "Category", key: "category", width: 25 },
    { header: "Image", key: "image", width: 40 },
  ];

  const products = await productRepository.findAllProducts();

  products.forEach((product) => {
    worksheet.addRow({
      uuid: product.uuid,
      name: product.name,
      price: Number(product.price),
      category: product.category.name,
      image: product.image ?? "",
    });
  });

  return workbook;
}