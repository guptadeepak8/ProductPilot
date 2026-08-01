import { Component, Inject, OnInit, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Category } from '../../../../shared/types/category';
import { CategoryService } from '../../category.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public category: Category | null,
  ) {}

  private readonly fb = inject(FormBuilder);

  private readonly service = inject(CategoryService);

  private readonly toast = inject(ToastService);

  private readonly dialogRef =
    inject(MatDialogRef<CategoryForm>);

  readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],
  });

  ngOnInit(): void {

    if (this.category) {

      this.form.patchValue({

        name: this.category.name,

      });

    }

  }

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    if (this.category) {

      this.update();

      return;

    }

    this.create();

  }

  private create(): void {

    this.service.create(this.form.getRawValue())
      .subscribe({

        next: response => {

          this.toast.success('Category created successfully.');

          this.dialogRef.close(response.data);

        },

        error: error => {

          this.toast.error(error.error?.message ?? 'Failed to create category.');

          console.error(error);

        },

      });

  }

  private update(): void {

    if (!this.category) {

      return;

    }

    this.service.update(
      this.category.id,
      this.form.getRawValue(),
    ).subscribe({

      next: response => {

        this.toast.success('Category updated successfully.');

        this.dialogRef.close(response.data);

      },

      error: error => {

        this.toast.error(error.error?.message ?? 'Failed to update category.');

        console.error(error);

      },

    });

  }

  close(): void {

    this.dialogRef.close();

  }

}
