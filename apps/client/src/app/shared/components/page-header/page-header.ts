import {
  Component,
  input,
  output,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {

  readonly title = input.required<string>();

  readonly subtitle = input.required<string>();

  readonly buttonText = input.required<string>();

  readonly create = output<void>();

}