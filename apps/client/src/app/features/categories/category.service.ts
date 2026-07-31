import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import {
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../shared/types/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);

  private readonly api = `${environment.apiUrl}/categories`;

  getAll() {
    return this.http.get<CategoriesResponse>(this.api);
  }

  getById(id: number) {
    return this.http.get<CategoryResponse>(`${this.api}/${id}`);
  }

  create(data: CreateCategoryRequest) {
    return this.http.post<CategoryResponse>(this.api, data);
  }
  update(id: number, data: UpdateCategoryRequest) {
    return this.http.put<CategoryResponse>(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
