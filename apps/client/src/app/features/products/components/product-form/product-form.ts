import { Component, Inject, OnInit, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Category, Product } from '../../../../shared/types';
import { ProductService } from '../../product.service';
import { CategoryService } from '../../../categories/category.service';
import { ToastService } from '../../../../shared/services/toast.service';



@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public product: Product | null,
  ) {}

  private readonly fb = inject(FormBuilder);

  private readonly productService = inject(ProductService);

  private readonly categoryService = inject(CategoryService);

  private readonly toast = inject(ToastService);

  private readonly dialogRef = inject(MatDialogRef<ProductForm>);

  readonly categories = signal<Category[]>([]);

  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],

    price: [0, [Validators.required, Validators.min(1)]],

    categoryId: [0, Validators.required],

    image: [''],
  });

  ngOnInit(): void {
    this.loadCategories();

    if (this.product) {
      this.form.patchValue({
        name: this.product.name,

        price: Number(this.product.price),

        categoryId: this.product.categoryId,

        image: this.product.image ?? '',
      });
    }
  }

  private loadCategories(): void {
    this.loading.set(true);

    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories.set(response.data);

        this.loading.set(false);
      },

      error: (error) => {
        console.error(error);

        this.loading.set(false);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    if (this.product) {
      this.update();

      return;
    }

    this.create();
  }

  private create(): void {
    const payload = {
      ...this.form.getRawValue(),

      image: this.form.value.image?.trim() || null,
    };

    this.productService.create(payload).subscribe({
      next: (response) => {
        this.toast.success('Product created successfully.');

        this.dialogRef.close(response.data);
      },

      error: error => {
        this.toast.error(error.error?.message ?? 'Failed to create product.');

        console.error(error);
      },
    });
  }

  private update(): void {
    if (!this.product) {
      return;
    }

    const payload = {
      ...this.form.getRawValue(),

      image: this.form.value.image?.trim() || null,
    };

    this.productService.update(this.product.id, payload).subscribe({
      next: (response) => {
        this.toast.success('Product updated successfully.');

        this.dialogRef.close(response.data);
      },

      error: error => {
        this.toast.error(error.error?.message ?? 'Failed to update product.');

        console.error(error);
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
