import ExcelJS from "exceljs";

import * as productRepository from "./product.repository.js";

export async function generateProductReport() {

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "ProductPilot";

  workbook.created = new Date();

  const worksheet =
    workbook.addWorksheet("Products");

  worksheet.columns = [

    {
      header: "ID",
      key: "id",
      width: 10,
    },

    {
      header: "Product",
      key: "name",
      width: 30,
    },

    {
      header: "Category",
      key: "category",
      width: 24,
    },

    {
      header: "Price",
      key: "price",
      width: 16,
    },

    {
      header: "Image URL",
      key: "image",
      width: 45,
    },

    {
      header: "Created At",
      key: "createdAt",
      width: 22,
    },

  ];

  worksheet.getRow(1).font = {

    bold: true,

    color: {

      argb: "FFFFFFFF",

    },

  };

  worksheet.getRow(1).fill = {

    type: "pattern",

    pattern: "solid",

    fgColor: {

      argb: "FF2563EB",

    },

  };

  worksheet.getRow(1).alignment = {

    vertical: "middle",

    horizontal: "center",

  };

  worksheet.views = [

    {

      state: "frozen",

      ySplit: 1,

    },

  ];

  worksheet.autoFilter = {

    from: "A1",

    to: "F1",

  };

  const products =
    await productRepository.findAllProducts();

  products.forEach(product => {

    worksheet.addRow({

      id: product.id,

      name: product.name,

      category: product.category.name,

      price: Number(product.price),

      image: product.image ?? "",

      createdAt: new Date(product.createdAt),

    });

  });

  worksheet.getColumn("price").numFmt =

    '"₹"#,##0.00';

  worksheet.getColumn("createdAt").numFmt =

    "dd-mmm-yyyy hh:mm";

  return workbook;

}