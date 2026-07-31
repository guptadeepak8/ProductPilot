import { Injectable, signal } from '@angular/core';

import { Product } from '../../shared/types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  readonly loading = signal(false);

  readonly products = signal<Product[]>([]);

  readonly page = signal(1);

  readonly limit = signal(10);

  readonly total = signal(0);

  readonly totalPages = signal(1);

  readonly search = signal('');

  readonly sort = signal<'asc' | 'desc'>('asc');

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  setProducts(products: Product[]) {
    this.products.set(products);
  }

  setPagination(page: number, totalPages: number, total: number) {
    this.page.set(page);

    this.totalPages.set(totalPages);

    this.total.set(total);
  }

  setSearch(search: string) {
    this.search.set(search);
  }

  toggleSort() {
    this.sort.update((value) => (value === 'asc' ? 'desc' : 'asc'));
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((value) => value + 1);
    }
  }

  previousPage() {
    if (this.page() > 1) {
      this.page.update((value) => value - 1);
    }
  }

  addProduct(product: Product) {
    this.products.update((list) => [product, ...list]);
  }

  updateProduct(product: Product) {
    this.products.update((list) => list.map((item) => (item.id === product.id ? product : item)));
  }

  removeProduct(id: number) {
    this.products.update((list) => list.filter((item) => item.id !== id));
  }

  resetPage() {

  this.page.set(1);

}
  
}
