import { Component, inject, signal } from '@angular/core';

import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PageHeader } from '../../../shared/components/page-header/page-header';

import { ReportService } from '../report.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    PageHeader,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.scss',
})
export class ReportsPage {

  private readonly service =
    inject(ReportService);

  readonly loading =
    signal(false);

  download(): void {

    this.loading.set(true);

    this.service
      .downloadProductsReport()
      .pipe(
        finalize(() =>
          this.loading.set(false),
        ),
      )
      .subscribe(blob => {

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement('a');

        const today =
          new Date()
            .toISOString()
            .split('T')[0];

        link.href = url;

        link.download =
          `products-${today}.xlsx`;

        link.click();

        URL.revokeObjectURL(url);

      });

  }

}