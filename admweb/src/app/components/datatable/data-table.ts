import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Http} from "@angular/http";
import {NotificationsService} from "../../service";
import {DataTableService} from "./data-table-service";
import {Observable, Subscription} from "rxjs";

/**
 Modified version of
 https://github.com/valor-software/ng2-table/
 using only server data in filter, sorting, paging etc
 **/

declare var $: any;

export class ColumnDefinition {
	propertyName: string;
	title: string = this.propertyName;
	sortingEnabled: boolean = false;
	sort: string = '';
	width: string;
	linkText: string;
	linkAction: string;
	linkUrl: string = '#';

	static define(propertyName: string, sortingEnabled: boolean = true, title: string = propertyName): ColumnDefinition {
		let column = new ColumnDefinition();
		column.propertyName = propertyName;
		column.title = title;
		column.sortingEnabled = sortingEnabled;
		return column;
	}

	static defineLink(linkText: string): ColumnDefinition {
		let column = new ColumnDefinition();
		column.linkText = linkText;
		return column;
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

export class ItemAction {
	action: string;
	item: any;
}

type ExcelExportStatus = 'PROCESSING' | 'FINISHED'| 'ERROR';

class ExcelExportStatusResponse {
	id: string;
	totalRecords: number = 1;
	processedRecords: number = 0;
	fileName: string;
	status: ExcelExportStatus = 'PROCESSING';
	errorMessage: string;
}

@Component({
	selector: 'data-table',
	template: `
<ng-content select="filters-panel"></ng-content>
<div class="modal" data-show="true" data-backdrop="false" id="exportExcelModal">
	<div class="modal-dialog" role="document" *ngIf="excelExportStatusResponse">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Exporting to Excel</h5>
			</div>
			<div class="modal-body">
				<div class="progress">
					<div class="progress-bar" role="progressbar" [attr.aria-valuenow]="exportProgressPercents" [style.width]="exportProgressPercents + '%'" aria-valuemin="0" aria-valuemax="100">
					{{excelExportStatusResponse.processedRecords}} / {{excelExportStatusResponse.totalRecords}}
					</div>
				</div>
			</div>
			<div class="modal-footer">
				 <button type="button" class="btn btn-secondary" (click)="cancelExcelExport()">Cancel</button>
			</div>
		</div>
	</div>
</div>
<table class="table dataTable" role="grid">
  <thead>
	<tr role="row">
	  <th *ngFor="let column of columns"  [ngStyle]="getColumnWidth(column)">
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
	  <ng-container *ngFor="let column of columns">	
	  	<td [innerHtml]="sanitize(getData(item, column.propertyName))" *ngIf="!column.linkText"></td>
	  	<td *ngIf="column.linkText" >
			<a [href]="getColumnLinkUrl(column, item)" (click)="doColumnClickAction(column, item)">{{column.linkText}}</a>
		</td>
	  </ng-container>
	</tr>
  </tbody>
</table>
<div class="row">
	<div class="col-md-6 d-flex">
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
	<div class="col-md-6 exportExcelLink" *ngIf="apiUrl">
		<a href="#" (click)="startExcelExport()">Export to Excel</a>
	</div>
</div>          
  `, styles: [` 
 	.exportExcelLink {
 		text-align: right;
 		padding-right: 5rem;
 	} 	
 `],
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

	public excelExportStatusResponse: ExcelExportStatusResponse;

	public exportProgressPercents: number = 0;

	private exportProgressPoller: Subscription;
		
	private entityPageQuery: EntityPageQuery;

	public newPageNumber: number;

	@Output()
	public openRow: EventEmitter<any> = new EventEmitter();

	@Output()
	public itemAction: EventEmitter<ItemAction> = new EventEmitter();

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

		this.dataTableService.loadDataSender$.subscribe(() => {
			this.entityPageQuery.page = 1;
			this.loadPageData()
		});
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
		this.http.post(this.apiUrl + '/list', this.entityPageQuery)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.notificationsService.hideOverlay();
					this.pageResult = data
				},
				(error) => {
					this.notificationsService.hideOverlay();
					this.notificationsService.showHttpServerError(error);
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

	getColumnWidth(col: ColumnDefinition) {
		return col.width ? {'width': col.width} : {};
	}

	getColumnLinkUrl(column: ColumnDefinition, item: any) {
		let propValue = this.getData(item, column.propertyName);
		return column.linkUrl.replace('{{' + column.propertyName + '}}', propValue)
	}

	doColumnClickAction(column: ColumnDefinition, item: any) {
		if (column.linkAction) {
			this.itemAction.emit({action: column.linkAction, item: item});
			return false;
		}
	}

	startExcelExport(): boolean {
		if (this.apiUrl) {
			this.excelExportStatusResponse = new ExcelExportStatusResponse();
			$('#exportExcelModal').modal('show');
			let query = {...this.entityPageQuery};
			query.page = undefined;
			query.pageSize = undefined;
			this.http.post(this.apiUrl + '/start-excel-export', query)
				.map(res => res.json())
				.subscribe(
					(response: ExcelExportStatusResponse) => {
						this.processExcelStatusResponse(response);
					},
					(error) => {
						$('#exportExcelModal').modal('hide');
						this.excelExportStatusResponse = undefined;
						this.notificationsService.showHttpServerError(error);
					}
				)

		}
		return false;
	}

	cancelExcelExport(): void {
		this.http.post('/api/admin/excel-export/cancel/' + this.excelExportStatusResponse.id, {})
			.subscribe();
		$('#exportExcelModal').modal('hide');
		this.exportProgressPoller.unsubscribe();
		this.excelExportStatusResponse = undefined;
	}

	private processExcelStatusResponse(response: ExcelExportStatusResponse) {
		this.excelExportStatusResponse = response;
		this.exportProgressPercents = Math.round(100 * (response.processedRecords | 0) / (response.totalRecords | 1));
		if (response.status == 'FINISHED') {
			this.downloadExcelFile(response);
		} else if (response.status == 'ERROR') {
			$('#exportExcelModal').modal('hide');
			this.excelExportStatusResponse = undefined;
			this.notificationsService.showHttpServerError('Export error occurred! ' + response.errorMessage);
		} else {
			this.waitForExcelFile(response);
		}
	}

	private waitForExcelFile(response: ExcelExportStatusResponse): void {
		this.exportProgressPoller = Observable.interval(1000)
			.timeInterval()
			.take(1)
			.subscribe(() => {
				this.http.get('/api/admin/excel-export/check/' + response.id)
					.map(res => res.json())
					.subscribe(
						(response: ExcelExportStatusResponse) => {
							this.processExcelStatusResponse(response);
						},
						(error) => {
							$('#exportExcelModal').modal('hide');
							this.excelExportStatusResponse = undefined;
							this.notificationsService.showHttpServerError(error);
						}
					)
			})
	}

	private downloadExcelFile(response: ExcelExportStatusResponse): void {
		$('exportExcelModal').modal('hide');
		this.excelExportStatusResponse = undefined;
		window.location.assign('/api/admin/excel-export/download/' + response.id)
	}
}
