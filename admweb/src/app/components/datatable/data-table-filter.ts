import {Component, OnInit, Input} from "@angular/core";
import {FilterDataType, Filter} from "./data-table";
import {DataTableService} from "./data-table-service";

const COMMON_OPERATIONS = ['=', '<>', 'is defined', 'not defined'];

@Component({
	selector: 'filters-panel',
	template: `
<div class="filter-buttons">
	<button class="btn btn-primary btn-sm" type="button" (click)="toggleShowFilterPanel()"><i class="fa fa-filter "></i> Filter</button>
	<button class="btn btn-info btn-sm" type="button" (click)="refreshData()"><i class="fa fa-refresh"></i> Refresh</button>
</div>
<div class="filter-panel" *ngIf="isFilterPanelVisible">
	<div class="card">
			<div class="card-block">
   				<ng-content select="filter"></ng-content>
				<div class="pull-right" >
					<button type="button" class="btn btn-primary btn-sm" (click)="applyFilter()" >
						<i class="fa fa-filter "></i> Apply
					</button>
					<button type="button" class="btn btn-warning btn-sm" (click)="resetFilters()" >
						<i class="fa fa-undo"></i> Reset
					</button>
					<button type="button" class="btn btn-secondary btn-sm" (click)="closePanel()" >
						<i class="fa fa-times"></i> Cancel
					</button>
				</div>   				
   			</div>
    </div>
</div>
`, styles: [`
.filter-panel {
    width: 640px;
    position: absolute;	
}
.filter-buttons {
  margin: 0.5rem 0 0.5rem 0;
`]
})
export class DataTableFiltersPanel {
	isFilterPanelVisible = false;

	constructor(private dataTableService: DataTableService) {
	}

	toggleShowFilterPanel(): void {
		this.isFilterPanelVisible = !this.isFilterPanelVisible;
	}

	closePanel(): void {
		this.isFilterPanelVisible = false;
	}

	resetFilters(): void {
		this.dataTableService.resetAllPageFilters();
	}

	applyFilter(): void {

	}

	refreshData(): void {

	}
	
}

@Component({
	selector: 'filter',
	template: `
<div class="row filter-row">
	<div class="col-3">{{title}}</div>
	<div class="col-3">
		<select class="custom-select form-control-sm" (change)="filterOperationSelected($event.target.value)">
		  <option value="">---</option>
	  	  <option *ngFor="let op of availableOperations" [value]="op" [selected]="op==filter.filterOperation">{{op}}</option>
		</select>
	</div>
	<div class="col-6 form-inline form-group">
		<input type="text" class="form-control form-control-sm filter-value" popover="" popover-trigger="focus" popover-placement="top" 
		[name]="filterValueFieldName1" [(ngModel)]="filter.filterValue1" [hidden]="hideFilterValue1" [ngClass]="{'error': hasErrorFilterValue1()}">
		<input type="text" class="form-control form-control-sm filter-value" popover="" popover-trigger="focus" popover-placement="top" 
		[name]="filterValueFieldName2" [(ngModel)]="filter.filterValue2" [hidden]="hideFilterValue2" [ngClass]="{'error': hasErrorFilterValue2()}">
	</div>
</div>
  `,
	styles: [`
	.filter-row {
		padding-bottom: 2px;
		border-bottom: 1px solid rgba(0, 0, 0, .125);
		margin-bottom: 0.5rem;
	}
	.filter-value {
		width: 135px;
		margin-right: 5px;
	}
	.error {
		border-color: #d9534f; 
	}
`]
})
export class DataTableFilter implements OnInit {

	@Input()
	title: string;

	@Input()
	property: string;

	@Input()
	type: FilterDataType;

	private filter: Filter;

	private hideFilterValue1 = true;
	private hideFilterValue2 = true;
	private filterStored = false;
	availableOperations: string[];

	constructor(private dataTableService: DataTableService) {
	}

	ngOnInit(): void {
		this.buildAvailableOperations();
		this.filter = this.loadAppStoredFilter();

		if (!this.filter) {
			this.filter = new Filter(this.property, this.type);
		} else {
			this.filterStored = true;
			if (this.filter.filterOperation) {
				this.filterOperationSelected(this.filter.filterOperation);
			}
		}

		this.dataTableService.filtersResetSender$.subscribe(
			() => this.filterOperationSelected('')
		)
	}

	private loadAppStoredFilter(): Filter {
		let storedQuery = this.dataTableService.readEntityPageQuery();
		if (storedQuery) {
			return storedQuery.filters.find(filter => filter.propertyName == this.property);
		}
		return undefined;
	}

	private storeNewFilter(): void {
		let storedQuery = this.dataTableService.readEntityPageQuery();
		storedQuery.filters.push(this.filter);
		this.filterStored = true;
	}

	private removeStoredFilter(): void {
		let storedQuery = this.dataTableService.readEntityPageQuery();
		let filterIndex = storedQuery.filters.findIndex(filter => filter.propertyName == this.property);
		if (filterIndex > -1) {
			storedQuery.filters.splice(filterIndex, 1);
		}
		this.filterStored = false;
	}

	private buildAvailableOperations(): void {
		switch (this.type) {
			case 'STRING' :
				this.availableOperations = COMMON_OPERATIONS.concat('empty', 'starts with', 'contain', 'not contain')
				break;
			case 'INTEGER' :
			case 'LONG':
			case 'BIG_DECIMAL' :
			case 'LOCAL_DATE' :
			case 'LOCAL_DATE_TIME' :
				this.availableOperations = COMMON_OPERATIONS.concat('>', '>=', '<', '<=', 'between');
				break;
			default:
				this.availableOperations = COMMON_OPERATIONS;
		}
	}

	private getRequiredParametersCount(operation: string): number {
		if (['=', '<>', '>', '>=', '<', '<=', 'starts with', 'contain', 'not contain', '>'].indexOf(operation) > -1) {
			return 1;
		} else if ('between' == operation) {
			return 2;
		}
		return 0;
	}

	filterOperationSelected(operation: string) {
		if (operation) {
			this.filter.filterOperation = operation;
		} else {
			this.filter.filterOperation = undefined;
			this.filter.filterValue1 = undefined;
			this.filter.filterValue2 = undefined;
		}

		let paramsCount = this.getRequiredParametersCount(operation);
		switch (paramsCount) {
			case 0:
				this.hideFilterValue1 = true;
				this.hideFilterValue2 = true;
				break;
			case 1:
				this.hideFilterValue1 = false;
				this.hideFilterValue2 = true;
				break;
			case 2:
				this.hideFilterValue1 = false;
				this.hideFilterValue2 = false;
				break;
		}

		if (this.filterStored && !this.filter.filterOperation) {
			this.removeStoredFilter();
		} else if (!this.filterStored && this.filter.filterOperation) {
			this.storeNewFilter();
		}
	}

	hasErrorFilterValue1(): boolean {
		return !this.hideFilterValue1 && !this.filter.filterValue1;
	}

	hasErrorFilterValue2(): boolean {
		return !this.hideFilterValue2 && !this.filter.filterValue2;
	}
}

