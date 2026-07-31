import { Component, OnInit, inject } from '@angular/core';

import { DatePipe } from '@angular/common';

import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';

import { ProductService } from '../product.service';
import { ProductStore } from '../product.store';

import { Product } from '../../../shared/types/product';



import { ConfirmDialog } from '../../../shared/components/dialogs/confirm-dialog/confirm-dialog';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductForm } from '../components/product-form/product-form';
@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [PageHeader, SearchBar, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage implements OnInit {
  private readonly service = inject(ProductService);
  private readonly search$ = new Subject<string>();
  readonly store = inject(ProductStore);

  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadProducts();

    this.search$

      .pipe(
        debounceTime(300),

        distinctUntilChanged(),
      )

      .subscribe((search) => {
        this.store.setSearch(search);

        this.store.resetPage(); 

        this.loadProducts();
      });
  }

  loadProducts(): void {
    this.store.setLoading(true);

    this.service
      .getAll(this.store.page(), this.store.limit(), this.store.search(), this.store.sort())
      .pipe(finalize(() => this.store.setLoading(false)))
      .subscribe({
        next: (response) => {
          this.store.setProducts(response.products);

          this.store.setPagination(
            response.pagination.page,

            response.pagination.totalPages,

            response.pagination.total,
          );
        },

        error: console.error,
      });
  }

  toggleSort(): void {
    this.store.toggleSort();

    this.loadProducts();
  }

  onSearch(search: string): void {

  this.search$.next(search);

}

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductForm, {
      width: '600px',

      panelClass: 'pp-dialog',

      disableClose: true,

      data: null,
    });

    dialogRef.afterClosed().subscribe((product) => {
      if (!product) {
        return;
      }

      this.store.addProduct(product);
    });
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductForm, {
      width: '600px',

      panelClass: 'pp-dialog',

      disableClose: true,

      data: product,
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (!updated) {
        return;
      }

      this.store.updateProduct(updated);
    });
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',

      panelClass: 'pp-dialog',

      data: {
        title: 'Delete Product',

        message: `Delete "${product.name}"?\n\nThis action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.service.delete(product.id).subscribe({
        next: () => {
          this.store.removeProduct(product.id);
        },

        error: console.error,
      });
    });
  }

  openImage(url: string | null): void {
    if (!url) {
      return;
    }

    window.open(url, '_blank');
  }
  nextPage(): void {
    this.store.nextPage();

    this.loadProducts();
  }

  previousPage(): void {
    this.store.previousPage();

    this.loadProducts();
  }
}
