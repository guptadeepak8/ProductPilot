import {
  Component,
  input,
  output,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {

  readonly placeholder =
    input('Search...');

  readonly searchChange =
    output<string>();

  search = '';

  onSearch(): void {

    this.searchChange.emit(this.search);

  }

}