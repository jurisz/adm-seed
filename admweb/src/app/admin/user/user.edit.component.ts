import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";
import {NotificationsService} from "../../service/notification.service";
import {ViewTabsService} from "../../service/viewtabs.service";

interface UserBean {
	id: number;
	username: string;
	roleName: string;
}

@Component({
	selector: 'user',
	templateUrl: './user.edit.html'
})
export class User implements OnInit, OnDestroy {

	userId: number;
	private routeSubscription: any;
	userData: UserBean = {id: undefined, username: undefined, roleName: undefined};
	private roleNames: string[];

	constructor(private route: ActivatedRoute,
				private http: Http,
				private notificationsService: NotificationsService,
				private viewTabsService: ViewTabsService) {
	}

	ngOnInit() {
		this.routeSubscription = this.route.params.subscribe(params => {
			this.userId = +params['id'];
			if (this.userId) {
				this.loadData(this.userId);
			} else {
				this.userData = {id: undefined, username: undefined, roleName: undefined};
			}
		});

		this.loadUserRoles();
	}

	ngOnDestroy(): void {
		this.routeSubscription.unsubscribe();
	}

	private loadData(userId: number) {
		this.notificationsService.showOverlay();
		this.http.get('/api/admin/security/user/' + userId)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.notificationsService.hideOverlay();
					this.userData = data;
				},
				(error) => {
					this.userData = null;
					this.notificationsService.hideOverlay();
					this.notificationsService.showHttpServerError(error);
				}
			)
	}

	cancel(): void {
		this.closeThisView();
	}

	private closeThisView() {
		let viewTitle = this.userId ? 'User: ' + this.userId : 'New user';
		this.viewTabsService.closeViewByTitle(viewTitle);
	}

	save(): void {
		let userCrudCommand = {
			operation: this.userId ? 'UPDATE' : 'CREATE',
			id: this.userId,
			username: this.userData.username,
			roleName: this.userData.roleName
		};
		this.notificationsService.showOverlay();
		this.notificationsService.clearFormErrorMessages();
		this.http.post('/api/admin/security/user/save', userCrudCommand)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.notificationsService.hideOverlay();
					this.notificationsService.registerNotification('User saved');
					this.closeThisView();
				},
				(error) => {
					this.notificationsService.hideOverlay();
					this.notificationsService.showFormOrServerErrors(error);
				}
			)
	}

	delete(): void {
		let confirmDialogData = {
			title: 'Delete User',
			message: 'Are you sure want to delete',
			callBack: this.userDelete
		};
		this.notificationsService.showConfirmDialog(confirmDialogData);
	}

	private userDelete: () => void = () => {
		let userCrudCommand = {
			operation: 'DELETE',
			id: this.userId,
		};
		this.notificationsService.showOverlay();
		this.http.post('/api/admin/security/user/save', userCrudCommand)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.notificationsService.hideOverlay();
					this.notificationsService.registerNotification('User deleted!');
					this.closeThisView();
				},
				(error) => {
					this.notificationsService.hideOverlay();
					this.notificationsService.showHttpServerError(error);
				}
			)
	};

	private loadUserRoles() {
		let query = {
			page: 1, pageSize: 200,
			sortOption: {propertyName: 'name', direction: 'ASC'}
		};
		this.http.post('/api/admin/security/user-role/list', query)
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.roleNames = data.results
						.map(role => role.name);
				}
			);
	}
}
