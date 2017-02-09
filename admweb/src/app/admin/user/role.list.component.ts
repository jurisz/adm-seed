import {Component} from "@angular/core";
import {ColumnDefinition} from "../../components/datatable/data-table";

@Component({
	selector: 'roles',
	template: `
    <h1>User roles</h1>
    
    <div>
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

	columns: Array<ColumnDefinition> = [
		ColumnDefinition.define('id'),
		ColumnDefinition.define('name')
	];

	apiUrl = '/api/admin/security/user-role/list';
	
	public openRow(item) {
		console.log('openRow')
		console.log(item)
	}
}
