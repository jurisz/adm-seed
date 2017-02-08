import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DataTableService} from "./data-table-service";

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

export class PageResult {
	totalRecords: number;
	page: number;
	results: Array<any>;

	static empty(): PageResult {
		return {totalRecords: 0, page: 0, results: []}
	}
}

export type FilterDataType = 'INTEGER' | 'LONG' | 'STRING' | 'BIG_DECIMAL' | 'BOOLEAN' | 'ENUM' | 'LOCAL_DATE' | 'LOCAL_DATE_TIME';

export class Filter {
	constructor(public propertyName: string, public parameterValueType: FilterDataType) {
	};
	filterOperation: string;
	filterValue1: string;
	filterValue2: string;
}

export class EntityPageQuery {
	page: number = 1;
	pageSize: number = 20;
	sortOption: {
		propertyName: string;
		direction: string;
	};
	filters: Filter[] = [];
}

@Component({
	selector: 'data-table',
	template: `
	<ng-content select="filters-panel"></ng-content>
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
        <tr *ngFor="let item of pageResult.results" (dblclick)="dblclickOnRow(item)">
          <td *ngFor="let column of columns" [innerHtml]="sanitize(getData(item, column.propertyName))"></td>
        </tr>
      </tbody>
      
      <pagination *ngIf="pageResult.totalRecords > 20"
      			[boundaryLinks]="true" [totalItems]="pageResult.totalRecords"  [(ngModel)]="currentPage" 
                itemsPerPage="20" previousText="&lsaquo;" nextText="&rsaquo;" firstText="&laquo;" lastText="&raquo;"></pagination>
    </table>
  `,
	providers: [DataTableService]
})
export class DataTableComponent implements OnInit {

	@Input()
	public columns: Array<ColumnDefinition> = [];

	@Input()
	public pageSize: number;

	@Input()
	public pageResult: PageResult = PageResult.empty();

	@Output()
	public tableSorting: EventEmitter<ColumnDefinition> = new EventEmitter();

	@Output()
	public openRow: EventEmitter<any> = new EventEmitter();

	private entityPageQuery: EntityPageQuery;

	public constructor(private sanitizer: DomSanitizer, private dataTableService: DataTableService) {
	}

	public sanitize(html: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(html);
	}

	ngOnInit(): void {
		this.storeEntityQueryIfNotExists();
	}

	private storeEntityQueryIfNotExists() {
		let storedQuery = this.dataTableService.readEntityPageQuery();
		if (!storedQuery) {
			this.entityPageQuery = new EntityPageQuery();
			this.dataTableService.storeEntityPageQuery(this.entityPageQuery);
		}
	}
	
	public sortBy(column: ColumnDefinition): boolean {
		for (let col of this.columns) {
			if (col.propertyName == column.propertyName) {
				column.sort = column.sort == 'DESC' ? 'ASC' : 'DESC';
			} else {
				col.sort = '';
			}
		}
		this.tableSorting.emit(column);
		return false;
	}

	public getData(item: any, propertyName: string): string {
		return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], item);
	}

	public dblclickOnRow(item: any): void {
		this.openRow.emit(item);
	}
}
