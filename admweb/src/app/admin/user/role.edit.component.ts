import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";
import {NotificationsService} from "../../service/notification.service";
import {CommonDialogsService} from "../../service/dialogs.service";
import {ViewTabsService} from "../../service/viewtabs.service";

interface UserRoleData {
	id: number;
	name: string;
	permissions: string[];
}

@Component({
	selector: 'role',
	templateUrl: './role.edit.html'
})
export class Role implements OnInit, OnDestroy {

	roleId: number;
	private routeSubscription: any;
	roleData: UserRoleData = {id: undefined, name: undefined, permissions: undefined};

	constructor(private route: ActivatedRoute,
				private http: Http,
				private notificationsService: NotificationsService,
				private dialogService: CommonDialogsService,
				private viewTabsService: ViewTabsService) {
	}

	ngOnInit() {
		this.routeSubscription = this.route.params.subscribe(params => {
			this.roleId = +params['id'];
			if (this.roleId) {
				this.loadRole(this.roleId);
			} else {
				this.roleData = {id: undefined, name: undefined, permissions: undefined};
			}
		});
	}

	ngOnDestroy(): void {
		this.routeSubscription.unsubscribe();
	}

	private loadRole(roleId: number) {
		this.notificationsService.showOverlay();
		this.http.get('/api/admin/security/user-role/role/' + roleId)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.notificationsService.hideOverlay();
					this.roleData = data;
				},
				(error) => {
					this.roleData = null;
					this.notificationsService.hideOverlay();
					this.dialogService.showHttpServerError(error);
				}
			)
	}

	cancel(): void {
		let viewTitle = this.roleId ? 'User role: ' + this.roleId : 'New role';
		this.viewTabsService.closeViewByTitle(viewTitle);
	}
}
