import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";
import {NotificationsService} from "../../service/notification.service";
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

	constructor(private route: ActivatedRoute,
				private http: Http,
				private notificationsService: NotificationsService,
				private viewTabsService: ViewTabsService) {
	}

	roleId: number;
	private routeSubscription: any;

	roleData: UserRoleData = {id: undefined, name: undefined, permissions: undefined};

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
					this.notificationsService.showHttpServerError(error);
				}
			)
	}

	cancel(): void {
		this.closeThisView();
	}

	private closeThisView() {
		let viewTitle = this.roleId ? 'User role: ' + this.roleId : 'New role';
		this.viewTabsService.closeViewByTitle(viewTitle);
	}

	save(): void {
		let roleCrudCommand = {
			operation: this.roleId ? 'UPDATE' : 'CREATE',
			id: this.roleId,
			name: this.roleData.name,
			permissions: this.roleData.permissions
		};
		this.notificationsService.showOverlay();
		this.http.post('/api/admin/security/user-role/save', roleCrudCommand)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.notificationsService.hideOverlay();
					this.notificationsService.registerNotification('User role data saved');
					this.closeThisView();
				},
				(error) => {
					this.notificationsService.hideOverlay();
					this.notificationsService.showHttpServerError(error);
				}
			)
	}

	delete(): void {
		let confirmDialogData = {
			title: 'Delete Role',
			message: 'Are you sure want to delete',
			callBack: this.roleDelete
		};
		this.notificationsService.showConfirmDialog(confirmDialogData);
	}

	private roleDelete: () => void = () => {
		let roleCrudCommand = {
			operation: 'DELETE',
			id: this.roleId,
		};
		this.notificationsService.showOverlay();
		this.http.post('/api/admin/security/user-role/save', roleCrudCommand)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.notificationsService.hideOverlay();
					this.notificationsService.registerNotification('User role data deleted!');
					this.closeThisView();
				},
				(error) => {
					this.notificationsService.hideOverlay();
					this.notificationsService.showHttpServerError(error);
				}
			)
	}
}
