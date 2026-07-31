import { Component, OnInit, inject } from '@angular/core';

import { finalize } from 'rxjs';

import { CategoryService } from '../category.service';
import { CategoryStore } from '../category.store';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { CategoryForm } from '../components/category-form/category-form';

import { Category } from '../../../shared/types';
import { ConfirmDialog } from '../../../shared/components/dialogs/confirm-dialog/confirm-dialog';
@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [PageHeader, SearchBar, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})
export class CategoriesPage implements OnInit {
  private readonly service = inject(CategoryService);
  private readonly dialog = inject(MatDialog);
  readonly store = inject(CategoryStore);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.store.setLoading(true);

    this.service
      .getAll()
      .pipe(finalize(() => this.store.setLoading(false)))
      .subscribe({
        next: (response) => {
          this.store.setCategories(response.data);
        },

        error: console.error,
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryForm, {
      width: '500px',

      disableClose: true,

      panelClass: 'pp-dialog',

      data: null,
    });

    dialogRef.afterClosed().subscribe((category) => {
      if (!category) {
        return;
      }

      this.store.addCategory(category);
    });
  }

  editCategory(category: Category): void {
    const dialogRef = this.dialog.open(CategoryForm, {
      width: '500px',

      disableClose: true,

      panelClass: 'pp-dialog',

      data: category,
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (!updated) {
        return;
      }

      this.store.updateCategory(updated);
    });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',

      panelClass: 'pp-dialog',

      data: {
        title: 'Delete Category',

        message: `Are you sure you want to delete "${category.name}"?\n\nThis action cannot be undone.`,

        confirmText: 'Delete',

        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.service.delete(category.id).subscribe({
        next: () => {
          this.store.removeCategory(category.id);
        },

        error: console.error,
      });
    });
  }
}
