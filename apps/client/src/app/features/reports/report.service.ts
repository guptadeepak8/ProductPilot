import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  private readonly http =
    inject(HttpClient);

  downloadProductsReport() {

    return this.http.get(

      `${environment.apiUrl}/products/report`,

      {

        responseType: 'blob',

      },

    );

  }

}