export interface Category {

  id: number;

  uuid: string;

  name: string;

  createdAt: string;

  updatedAt: string;

}

export interface CategoryResponse {

  success: boolean;

  data: Category;

}

export interface CategoriesResponse {

  success: boolean;

  data: Category[];

}

export interface CreateCategoryRequest {

  name: string;

}

export interface UpdateCategoryRequest {

  name: string;

}