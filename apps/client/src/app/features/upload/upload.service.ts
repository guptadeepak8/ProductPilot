import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BulkUploadResponse } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  private readonly http =
    inject(HttpClient);
upload(file: File) {

  const formData = new FormData();

  formData.append("file", file);

  return this.http.post<BulkUploadResponse>(

    `${environment.apiUrl}/products/bulk-upload`,

    formData,

  );

}

}