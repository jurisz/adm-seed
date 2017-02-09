import {Component} from "@angular/core";
import {ColumnDefinition} from "../../components/datatable/data-table";

@Component({
	selector: 'users',
	templateUrl: './user.list.html'
})
export class Users {

	columns: Array<ColumnDefinition> = [
		ColumnDefinition.define('id'),
		ColumnDefinition.define('username'),
		ColumnDefinition.define('roleName', false),
	];

	apiUrl = '/api/admin/security/user/list';

}
