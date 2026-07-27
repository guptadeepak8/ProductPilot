import type { Request, Response, NextFunction } from "express";

import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
} from "./product.service.js";
import { bulkUploadProducts } from "./product.bulk.service.js";
import { generateProductReport } from "./product.report.service.js";

export async function createProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await createProductService({
    ...req.body,
    image: req.file?.filename ?? null
});

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const sort =
      req.query.sort === "desc"
        ? "desc"
        : "asc";

    const result = await getProductsService(
      page,
      limit,
      search,
      sort
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    const product = await getProductByIdService(id);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    const product = await updateProductService(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    await deleteProductService(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function bulkUploadController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    const count = await bulkUploadProducts(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Products uploaded successfully",
      count,
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadReportController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const workbook = await generateProductReport();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="products.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    next(error);
  }
}