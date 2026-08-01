import { TestBed } from '@angular/core/testing';

import { ProductStore } from './product.store';
import { Product } from '../../shared/types';

describe('ProductStore', () => {
  let store: ProductStore;

  const product = (id: number, name: string): Product => ({
    id,
    uuid: `product-${id}`,
    name,
    image: null,
    price: id * 100,
    categoryId: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    category: {
      id: 1,
      uuid: 'category-1',
      name: 'Electronics',
    },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ProductStore);
  });

  it('adds, updates, and deletes a product', () => {
    const first = product(1, 'Keyboard');
    const second = product(2, 'Mouse');

    store.setProducts([first]);
    store.addProduct(second);
    store.updateProduct({ ...first, name: 'Mechanical Keyboard' });
    store.removeProduct(2);

    expect(store.products()).toEqual([{ ...first, name: 'Mechanical Keyboard' }]);
  });

  it('updates search state', () => {
    store.setSearch('keyboard');

    expect(store.search()).toBe('keyboard');
  });

  it('toggles sort state', () => {
    store.toggleSort();

    expect(store.sort()).toBe('desc');
  });

  it('updates pagination state', () => {
    store.setPagination(2, 4, 35);
    store.nextPage();
    store.previousPage();

    expect(store.page()).toBe(2);
    expect(store.totalPages()).toBe(4);
    expect(store.total()).toBe(35);
  });
});
