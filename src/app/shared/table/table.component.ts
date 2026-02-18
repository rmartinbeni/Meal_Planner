import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'meal-planner-table',
  standalone: true,
  imports: [TableModule, InputTextModule, CardModule, ButtonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends object> {
  data = input.required<T[]>();
  columns = input.required<(keyof T)[]>();
  title = input<string>();
  rows = input(10);
  rowsPerPageOptions = input([10, 25, 50, 100]);
  showCaption = input(true);
  showCheckboxes = input(true);
  showFilters = input(true);
  showPaginator = input(true);
  showSorters = input(true);
  addItem = output<void>();
}
