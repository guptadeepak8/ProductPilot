import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ProductForm } from './product-form';
import { ProductService } from '../../product.service';
import { CategoryService } from '../../../categories/category.service';
import { Product } from '../../../../shared/types';

describe('ProductForm', () => {
  let fixture: ComponentFixture<ProductForm>;
  let component: ProductForm;
  let productService: { create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  const savedProduct: Product = {
    id: 1,
    uuid: 'product-1',
    name: 'Keyboard',
    image: null,
    price: 1200,
    categoryId: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    category: {
      id: 3,
      uuid: 'category-3',
      name: 'Electronics',
    },
  };

  beforeEach(async () => {
    productService = {
      create: vi.fn().mockReturnValue(of({ success: true, data: savedProduct })),
      update: vi.fn(),
    };
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: dialogRef },
        {
          provide: CategoryService,
          useValue: {
            getAll: vi.fn().mockReturnValue(of({
              success: true,
              data: [{ id: 3, uuid: 'category-3', name: 'Electronics', createdAt: '', updatedAt: '' }],
            })),
          },
        },
        { provide: ProductService, useValue: productService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('marks the form invalid when required values are missing', () => {
    component.form.patchValue({ name: '', price: 0, categoryId: 0 });

    component.save();

    expect(component.form.invalid).toBe(true);
    expect(productService.create).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('submits expected data and closes with the saved product', () => {
    component.form.setValue({
      name: 'Keyboard',
      price: 1200,
      categoryId: 3,
      image: '  ',
    });

    component.save();

    expect(productService.create).toHaveBeenCalledWith({
      name: 'Keyboard',
      price: 1200,
      categoryId: 3,
      image: null,
    });
    expect(dialogRef.close).toHaveBeenCalledWith(savedProduct);
  });
});
