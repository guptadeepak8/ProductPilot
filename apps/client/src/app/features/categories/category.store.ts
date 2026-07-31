import {
  Injectable,
  computed,
  signal,
} from '@angular/core';

import { Category } from '../../shared/types/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryStore {

  private readonly _categories =
    signal<Category[]>([]);

  private readonly _loading =
    signal(false);

  readonly categories =
    this._categories.asReadonly();

  readonly loading =
    this._loading.asReadonly();

  readonly total =
    computed(() =>
      this.categories().length
    );

  setCategories(
    categories: Category[],
  ) {

    this._categories.set(categories);

  }

  addCategory(
    category: Category,
  ) {

    this._categories.update(state => [
      category,
      ...state,
    ]);

  }

  updateCategory(
    category: Category,
  ) {

    this._categories.update(state =>
      state.map(item =>
        item.id === category.id
          ? category
          : item
      )
    );

  }

  removeCategory(id: number) {

    this._categories.update(state =>
      state.filter(item =>
        item.id !== id
      )
    );

  }

  setLoading(value: boolean) {

    this._loading.set(value);

  }

}