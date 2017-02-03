import {Component, OnInit, EventEmitter, Input, Output} from "@angular/core";
import {FilterDataType} from "./ng-table";

const COMMON_OPERATIONS = ['=', '<>', 'is defined', 'not defined'];

@Component({
	selector: 'filters-panel',
	template: `
<div class="filter-buttons">
	<button class="btn btn-primary btn-sm" type="button" (click)="showFilterPanel()"><i class="fa fa-filter "></i> Filter</button>
	<button class="btn btn-info btn-sm" type="button" (click)="refreshData()"><i class="fa fa-refresh"></i> Refresh</button>
</div>
<div class="filter-panel" *ngIf="isFilterPanelVisible">
	<div class="card">
			<div class="card-block">
   				<ng-content></ng-content>
				<div class="pull-right" >
					<button type="button" class="btn btn-primary btn-sm" ng-click="applyFilter()" >
						<i class="fa fa-filter "></i> Apply
					</button>
					<button type="button" class="btn btn-warning btn-sm" ng-click="resetFilters()" >
						<i class="fa fa-undo"></i> Reset
					</button>
					<button type="button" class="btn btn-secondary btn-sm" ng-click="closePanel()" >
						<i class="fa fa-times"></i> Cancel
					</button>
				</div>   				
   			</div>
    </div>
</div>
`, styles: [`
.filter-panel {
    width: 600px;
    position: absolute;	
}
.filter-buttons {
  margin: 0.5rem 0 0.5rem 0;
`]
})
export class NgTableFiltersPanel {
	isFilterPanelVisible = false;

	showFilterPanel(): void {
		this.isFilterPanelVisible = true;
	}
}

@Component({
	selector: 'filter',
	template: `
<div class="row filter-row">
	<div class="col-3">{{title}}</div>
	<div class="col-2 dropdown">
		<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			-----
		</button>
		<div class="dropdown-menu">
			<a class="dropdown-item" href="#" (click)='bla()'>&nbsp;</a>
			<a class="dropdown-item" href="#" (click)="bla(operation)" *ngFor="let operation of availableOperations">{{operation}}</a>
		</div>
	</div>
	<div class="col-7">
		<input type="text" class="form-control form-control-sm" popover="" popover-trigger="focus" popover-placement="top">
	</div>
</div>
  `, styles: [`
		.filter-row {
			padding-bottom: 2px;
			border-bottom: 1px solid rgba(0, 0, 0, .125);
			margin-bottom: 0.5rem;
		}
	`]
})
export class NgTableFilter implements OnInit {

	@Input()
	title: string;

	@Input()
	property: string;

	@Input()
	type: FilterDataType;

	operation: string;
	value1: string;
	value2: string;
	availableOperations: string[];
	errorMessage: string;


	@Output() onVoted = new EventEmitter<boolean>();

	vote(agreed: boolean) {
		this.onVoted.emit(agreed);
	}

	ngOnInit(): void {
		this.buildAvailableOperations();
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

	public isValid(): boolean {
		if (this.operation) {
			let parametersCount = 0;
			if (['is defined', 'not defined', 'empty'].indexOf(this.operation) > -1) {
				parametersCount = 0;
			} else if (['=', '<>', '>', '>=', '<', '<=', 'starts with', 'contains', 'not contains', '>'].indexOf(this.operation) > -1) {
				parametersCount = 1;
			} else if ('between' == this.operation) {
				parametersCount = 2;
			}

			if (parametersCount == 1 && !this.value1) {
				this.errorMessage = 'One parameter is mandatory';
				return false;
			}

			if (parametersCount == 2 && !this.value1 && !this.value2) {
				this.errorMessage = '2 parameters are required';
				return false;
			}
		}
	}
}

