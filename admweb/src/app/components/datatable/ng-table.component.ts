import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

/**
 Modified version of
 https://github.com/valor-software/ng2-table/
 using only server data in filter, sorting, paging etc
 **/

export class ColumnDefinition {
	propertyName: String;
	title: String = this.propertyName;
	sortingEnabled: boolean = false;
	sort: String = '';

	static define(propertyName: String, sortingEnabled: boolean = true, title: String = propertyName): ColumnDefinition {
		return {
			propertyName: propertyName,
			title: title,
			sortingEnabled: sortingEnabled,
			sort: ''
		}
	}
}

@Component({
	selector: 'ng-table',
	template: `
    <table class="table dataTable" role="grid">
      <thead>
        <tr role="row">
          <th *ngFor="let column of columns"  >
            {{column.title}}
            <a *ngIf="column.sortingEnabled" (click)="sortBy(column)" href="#">
			  <i class="fa aw-fa-sm"
			  [ngClass]="{'fa-chevron-right': column.sort === '', 'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}"> </i>
            </a>  
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of rows" (dblclick)="dblclickOnRow(row)">
          <td *ngFor="let column of columns" [innerHtml]="sanitize(getData(row, column.propertyName))"></td>
        </tr>
      </tbody>
      
      <pagination *ngIf="totalItems <= itemsPerPage"
      			[boundaryLinks]="true" [totalItems]="totalItems"  [(ngModel)]="currentPage" 
                itemsPerPage="20" previousText="&lsaquo;" nextText="&rsaquo;" firstText="&laquo;" lastText="&raquo;"></pagination>
    </table>
  `
})
export class NgTableComponent {
	private _columns: Array<ColumnDefinition> = [];

	// Table values
	@Input() public rows: Array<any> = [];

	// Outputs (Events)
	@Output() public tableSorting: EventEmitter<ColumnDefinition> = new EventEmitter();
	@Output() public openRow: EventEmitter<any> = new EventEmitter();

	@Input()
	public set columns(values: Array<ColumnDefinition>) {
		this._columns = values;
	}

	public constructor(private sanitizer: DomSanitizer) {
	}

	public sanitize(html: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(html);
	}

	public get columns(): Array <ColumnDefinition> {
		return this._columns;
	}

	public sortBy(column: ColumnDefinition): boolean {
		for (let col of this._columns) {
			if (col.propertyName == column.propertyName) {
				column.sort = column.sort == 'desc' ? 'asc' : 'desc';
			} else {
				col.sort = '';
			}
		}
		this.tableSorting.emit(column);
		return false;
	}

	public getData(row: any, propertyName: string): string {
		return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
	}

	public dblclickOnRow(row: any): void {
		this.openRow.emit(row);
	}
}
