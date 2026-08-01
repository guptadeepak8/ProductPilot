import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

export interface ToastData {
  message: string;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: ToastData,
    private readonly snackBarRef: MatSnackBarRef<Toast>,
  ) {}

  close(): void {
    this.snackBarRef.dismiss();
  }
}
