import { Router } from "express";

import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "./category.controller.js";
import { validate } from "../../middleware/validate.js";
import { createCategorySchema } from "./category.schema.js";

const router = Router();

router.post("/", validate(createCategorySchema), createCategoryController);

router.get("/", getAllCategoriesController);

router.get("/:id", getCategoryByIdController);

router.put("/:id",validate(createCategorySchema),updateCategoryController); 

router.delete("/:id",deleteCategoryController);

export default router;