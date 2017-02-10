import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Http} from "@angular/http";
import {NotificationsService} from "../../service";
import {DataTableService} from "./data-table-service";

/**
 Modified version of
 https://github.com/valor-software/ng2-table/
 using only server data in filter, sorting, paging etc
 **/

export class ColumnDefinition {
	propertyName: string;
	title: string = this.propertyName;
	sortingEnabled: boolean = false;
	sort: string = '';

	static define(propertyName: string, sortingEnabled: boolean = true, title: string = propertyName): ColumnDefinition {
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
		  [ngClass]="{'fa-chevron-right': column.sort === '', 'fa-chevron-down': column.sort === 'DESC', 'fa-chevron-up': column.sort === 'ASC'}"> </i>
		</a>  
	  </th>
	</tr>
  </thead>
  <tbody>
	<tr *ngFor="let item of pageResult.results" (dblclick)="dblclickOnRow(item)">
	  <td *ngFor="let column of columns" [innerHtml]="sanitize(getData(item, column.propertyName))"></td>
	</tr>
  </tbody>
</table>
<div class="d-flex">
	<div class="p-2"> <b>{{pageResult.totalRecords}}</b> records; page: <b>{{currentPage}}</b></div>
	<div class="data-table-pagination">
		<pagination *ngIf="pageResult.totalRecords > entityPageQuery.pageSize"  [totalItems]="pageResult.totalRecords"  [(ngModel)]="currentPage" 
			itemsPerPage="20" [boundaryLinks]="true" [maxSize]="5" previousText="&lsaquo;" nextText="&rsaquo;" firstText="&laquo;" lastText="&raquo;"></pagination>
	</div>
	<div class="p-2 form-inline" *ngIf="pageResult.totalRecords > entityPageQuery.pageSize">
		<input type="text" style="width:50px;" class="form-control form-control-sm" [(ngModel)]="newPageNumber">
		&nbsp;
		<button [hidden]="newPageNumber == currentPage" (click)="goToNewPage()" class="btn btn-info btn-sm" type="button">Set page</button>
	</div>	        
</div>          
  `,
	providers: [DataTableService]
})
export class DataTableComponent implements OnInit {

	@Input()
	public columns: Array<ColumnDefinition> = [];

	@Input()
	public pageSize: number;

	@Input()
	public apiUrl: string;

	@Input()
	public pageResult: PageResult = PageResult.empty();

	private entityPageQuery: EntityPageQuery;
	
	public newPageNumber: number;

	@Output()
	public openRow: EventEmitter<any> = new EventEmitter();

	public constructor(private sanitizer: DomSanitizer,
					   private http: Http,
					   private dataTableService: DataTableService,
					   private notificationsService: NotificationsService) {
	}

	public sanitize(html: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(html);
	}

	ngOnInit(): void {
		this.storeEntityQueryIfNotExists();
		if (this.pageSize) {
			this.entityPageQuery.pageSize = this.pageSize
		}
		this.newPageNumber = this.entityPageQuery.page;

		if (this.apiUrl) {
			this.loadPageData();
		}

		this.dataTableService.loadDataSender$.subscribe(() => this.loadPageData());
	}

	private storeEntityQueryIfNotExists() {
		let storedQuery = this.dataTableService.readEntityPageQuery();
		if (!storedQuery) {
			this.entityPageQuery = new EntityPageQuery();
			this.dataTableService.storeEntityPageQuery(this.entityPageQuery);
		} else {
			this.entityPageQuery = storedQuery;
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
		this.entityPageQuery.sortOption = {propertyName: column.propertyName, direction: column.sort};
		this.currentPage = 1; 
		return false;
	}

	public getData(item: any, propertyName: string): string {
		return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], item);
	}

	public dblclickOnRow(item: any): void {
		this.openRow.emit(item);
	}

	private loadPageData() {
		this.notificationsService.showOverlay();
		this.http.post(this.apiUrl, this.entityPageQuery)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.notificationsService.hideOverlay();
					this.pageResult = data
				},
				(error) => {
					this.notificationsService.hideOverlay();
					//global error
				}
			)
	}

	set currentPage(val: number) {
		this.entityPageQuery.page = val;
		this.loadPageData();
		this.newPageNumber = val;
	}

	get currentPage(): number {
		return this.entityPageQuery.page;
	}

	goToNewPage() {
		this.currentPage = this.newPageNumber;
	}
}