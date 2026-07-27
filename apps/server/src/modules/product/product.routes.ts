import { Router } from "express";

import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  bulkUploadController,
  downloadReportController,
} from "./product.controller.js";

import { validate } from "../../middleware/validate.js";

import { createProductSchema } from "./product.schema.js";
import { upload } from "../../middleware/upload.js";

const router = Router();



router.post(
  "/",
    upload.single("image"),
  validate(createProductSchema),
  createProductController
);

router.post(
  "/bulk-upload",
  upload.single("file"),
  bulkUploadController
);

router.get(
  "/report",
  downloadReportController
);

router.get(
  "/",
  getProductsController
);

router.get(
  "/:id",
  getProductByIdController
);

router.put(
  "/:id",
   upload.single("image"),
  validate(createProductSchema),
  updateProductController
);

router.delete(
  "/:id",
  deleteProductController
);

export default router;