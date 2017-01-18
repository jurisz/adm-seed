import {Component, OnInit} from "@angular/core";

@Component({
	selector: 'roles',
	template: `
    <h1>User roles</h1>
    
    <div>
      <ngx-datatable class="material"
        [rows]="rows"
        [columns]="columns">
      </ngx-datatable>
    </div>
  `
})
export class Roles implements OnInit {

	rows = [
		{name: 'Austin', gender: 'Male', company: 'Swimlane'},
		{name: 'Dany', gender: 'Male', company: 'KFC'},
		{name: 'Molly', gender: 'Female', company: 'Burger King'},
	];
	columns = [
		{prop: 'name'},
		{name: 'Gender'},
		{name: 'Company'}
	];
	
	constructor() {
	}

	ngOnInit() {

	}
}
