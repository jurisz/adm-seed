import {Component} from "@angular/core";
import {ColumnDefinition} from "../../components/datatable/data-table";
import {Router} from "@angular/router";

@Component({
	selector: 'roles',
	template: `
<div>
	<div class="float-right">
		<a class="btn btn-primary btn-sm" [routerLink]=" ['../user-role'] ">Create</a>
	</div>
 	<data-table [apiUrl]="apiUrl" [columns]="columns" (openRow)="openRow($event)">
		<filters-panel>
			<filter title="id" property="id" type="LONG"></filter>
			<filter title="name" property="name" type="STRING"></filter>
		</filters-panel>
	</data-table>
</div>
  `
})
export class Roles {

	constructor(private router: Router) {
	}

	columns: Array<ColumnDefinition> = [
		ColumnDefinition.define('id'),
		ColumnDefinition.define('name')
	];

	apiUrl = '/api/admin/security/user-role';

	public openRow(item) {
		this.router.navigate(['/admin/user-role', item.id]);
	}
}
