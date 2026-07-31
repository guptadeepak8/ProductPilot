export interface Product {

  id: number;

  uuid: string;

  name: string;

  image: string | null;

  price: number;

  categoryId: number;

  createdAt: string;

  updatedAt: string;

  category: {

    id: number;

    uuid: string;

    name: string;

  };

}

export interface ProductsResponse {

  success: boolean;

  products: Product[];

  pagination: {

    page: number;

    limit: number;

    total: number;

    totalPages: number;

  };

}

export interface ProductResponse {

  success: boolean;

  data: Product;

}

export interface CreateProductRequest {

  name: string;

  price: number;

  image: string | null;

  categoryId: number;

}

export type UpdateProductRequest =
  CreateProductRequest;