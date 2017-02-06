import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {ColumnDefinition, PageResult} from "../../components/datatable/data-table";

@Component({
	selector: 'users',
	templateUrl: './user.list.html'
})
export class Users implements OnInit {

	columns: Array<ColumnDefinition> = [
		ColumnDefinition.define('id'),
		ColumnDefinition.define('username'),
		ColumnDefinition.define('roleName', false),
	];

	pageResult = PageResult.empty;

	pageQuery = {
		page: 1,
		pageSize: 20
	};

	constructor(private http: Http) {
	}

	ngOnInit() {
		this.loadPageData()
	}

	public loadPageData() {
		this.http.post('/api/admin/security/user/list', this.pageQuery)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.pageResult = data
				},
				(error) => {
					//global error
				}
			)
	}
}
