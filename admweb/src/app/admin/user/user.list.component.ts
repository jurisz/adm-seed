import {Component} from "@angular/core";
import {ColumnDefinition, ItemAction} from "../../components/datatable/data-table";
import {Router} from "@angular/router";

@Component({
	selector: 'users',
	templateUrl: './user.list.html'
})
export class Users {

	constructor(private router: Router) {
	}

	private defineColumns() {
		let editCol = ColumnDefinition.defineLink('Edit');
		editCol.linkAction = 'edit';
		editCol.propertyName = 'id';
		editCol.width = '60px';

		let deleteCol = ColumnDefinition.defineLink('Delete');
		deleteCol.linkUrl = '#/admin/user/{{id}}/delete';
		deleteCol.propertyName = 'id';
		deleteCol.width = '60px';

		return [
			editCol,
			deleteCol,
			ColumnDefinition.define('id'),
			ColumnDefinition.define('username'),
			ColumnDefinition.define('roleName', false),
		];
	}

	columns: Array<ColumnDefinition> = this.defineColumns();

	apiUrl = '/api/admin/security/user';

	doItemAction(itemAction: ItemAction) {
		if (itemAction.action == 'edit') {
			this.editUser(itemAction.item)
		}
	}

	public openRow(item) {
		this.editUser(item);
	}

	private editUser(item) {
		this.router.navigate(['/admin/user', item.id]);
	}
}
