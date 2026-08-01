import { Component, inject, signal } from '@angular/core';

import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PageHeader } from '../../../shared/components/page-header/page-header';

import { UploadService } from '../upload.service';
import { ToastService } from '../../../shared/services/toast.service';

interface UploadResult {

  imported: number;

  skipped: number;

  errors: {

    row: number;

    reason: string;

  }[];

}

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [
    PageHeader,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.scss',
})
export class UploadPage {

  private readonly service =
    inject(UploadService);

  private readonly toast =
    inject(ToastService);

  readonly file =
    signal<File | null>(null);

  readonly uploading =
    signal(false);

  readonly uploadResult =
    signal<UploadResult | null>(null);

  readonly error =
    signal('');

  selectFile(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files?.length) {

      return;

    }

    const file =
      input.files[0];

    this.error.set('');

    this.uploadResult.set(null);

    if (!file.name.toLowerCase().endsWith('.csv')) {

      this.error.set(
        'Only CSV files are allowed.'
      );

      input.value = '';

      return;

    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      this.error.set(
        'Maximum allowed size is 5 MB.'
      );

      input.value = '';

      return;

    }

    this.file.set(file);

  }

  upload(): void {

    if (!this.file()) {

      return;

    }

    this.uploading.set(true);

    this.error.set('');

    this.uploadResult.set(null);

    this.service
      .upload(this.file()!)
      .pipe(
        finalize(() => {

          this.uploading.set(false);

        }),
      )
      .subscribe({

        next: response => {

          this.uploadResult.set({

            imported: response.imported,

            skipped: response.skipped,

            errors: response.errors,

          });

          this.file.set(null);

          this.toast.success('Products uploaded successfully.');

        },

        error: error => {

          this.error.set(

            error.error?.message ??

            'Upload failed.'

          );

          this.toast.error(

            error.error?.message ??

            'Upload failed.'

          );

        },

      });

  }

}
