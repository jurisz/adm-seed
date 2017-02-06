import {Component, OnInit} from "@angular/core";
import {ColumnDefinition, PageResult} from "../../components/datatable/data-table";

@Component({
	selector: 'roles',
	template: `
    <h1>User roles</h1>
    
    <div>
     <data-table [pageResult]="pageResult" [columns]="columns" (openRow)="openRow($event)">
     
	</data-table>
    </div>
  `
})
export class Roles implements OnInit {

	pageResult: PageResult = {
		page: 1,
		totalRecords: 3,
		results: [
			{name: 'Austin', gender: 'Male', company: 'Swimlane'},
			{name: 'Dany', gender: 'Male', company: 'KFC'},
			{name: 'Molly', gender: 'Female', company: 'Burger King'},
		]
	};

	columns: Array<ColumnDefinition> = [
		ColumnDefinition.define('name'),
		ColumnDefinition.define('gender', false),
		ColumnDefinition.define('company'),
	];

	constructor() {
	}

	ngOnInit() {
	}

	public loadPageData() {

	}

	public openRow(item) {
		console.log('openRow')
		console.log(item)
	}
}
