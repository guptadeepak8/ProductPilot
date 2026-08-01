import { TestBed } from '@angular/core/testing';

import { CategoryStore } from './category.store';
import { Category } from '../../shared/types';

describe('CategoryStore', () => {
  let store: CategoryStore;

  const category = (id: number, name: string): Category => ({
    id,
    uuid: `category-${id}`,
    name,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CategoryStore);
  });

  it('adds a category to the top of the list', () => {
    const existing = category(1, 'Electronics');
    const added = category(2, 'Books');

    store.setCategories([existing]);
    store.addCategory(added);

    expect(store.categories()).toEqual([added, existing]);
    expect(store.total()).toBe(2);
  });

  it('updates an existing category', () => {
    store.setCategories([category(1, 'Electronics'), category(2, 'Books')]);

    store.updateCategory(category(2, 'Stationery'));

    expect(store.categories()[1].name).toBe('Stationery');
  });

  it('deletes a category', () => {
    store.setCategories([category(1, 'Electronics'), category(2, 'Books')]);

    store.removeCategory(1);

    expect(store.categories()).toEqual([category(2, 'Books')]);
  });
});
