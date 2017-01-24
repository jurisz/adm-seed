import {Component, OnInit} from "@angular/core";
import {ColumnDefinition} from "../../components/datatable/ng-table.component";

@Component({
	selector: 'roles',
	template: `
    <h1>User roles</h1>
    
    <div>
     <ng-table [rows]="rows" [columns]="columns">
     
	</ng-table>
    </div>
  `
})
export class Roles implements OnInit {

	rows = [
		{name: 'Austin', gender: 'Male', company: 'Swimlane'},
		{name: 'Dany', gender: 'Male', company: 'KFC'},
		{name: 'Molly', gender: 'Female', company: 'Burger King'},
	];

	columns: Array<ColumnDefinition> = [
		ColumnDefinition.define('name'),
		ColumnDefinition.define('gender', false),
		ColumnDefinition.define('company'),
	];

	constructor() {
	}

	ngOnInit() {
	}
}
