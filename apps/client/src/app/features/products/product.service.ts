import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import {
  ProductResponse,
  ProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from '../../shared/types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly api = `${environment.apiUrl}/products`;

  getAll(
    page = 1,

    limit = 10,

    search = '',

    sort: 'asc' | 'desc' = 'asc',
  ) {
    return this.http.get<ProductsResponse>(
      this.api,

      {
        params: {
          page,

          limit,

          search,

          sort,
        },
      },
    );
  }

  getById(id: number) {
    return this.http.get<ProductResponse>(`${this.api}/${id}`);
  }

  create(data: CreateProductRequest) {
    return this.http.post<ProductResponse>(
      this.api,

      data,
    );
  }

  update(
    id: number,

    data: UpdateProductRequest,
  ) {
    return this.http.put<ProductResponse>(
      `${this.api}/${id}`,

      data,
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
