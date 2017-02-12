import {Component} from "@angular/core";
import {ColumnDefinition, ItemAction} from "../../components/datatable/data-table";

@Component({
	selector: 'users',
	templateUrl: './user.list.html'
})
export class Users {

	private defineColumns() {
		let editCol = ColumnDefinition.defineLink('Edit');
		editCol.linkAction = 'edit';
		editCol.propertyName = 'id';
		editCol.width = '60px';

		let deleteCol = ColumnDefinition.defineLink('Delete');
		deleteCol.linkUrl = '/admin/user/{{id}}/delete';
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

	apiUrl = '/api/admin/security/user/list';

	doItemAction(itemAction: ItemAction) {
		console.log("item action performed: " + itemAction.action + " item:" + itemAction.item.id);
	}
}
