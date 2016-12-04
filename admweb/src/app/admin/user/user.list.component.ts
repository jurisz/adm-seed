import {Component, OnInit} from "@angular/core";
import {NotificationsService} from "../../components/notificaton/notification.service";

@Component({
	selector: 'users',
	template: `
    <h1>Users</h1>
    
    <button type="button" class="btn btn-success" (click)="showNotification()">Notification</button>
    <button type="button" class="btn btn-success" (click)="showSpinner()">Overlay show</button>
  `
})
export class Users implements OnInit {

	constructor(private notificationService: NotificationsService) {
	}

	ngOnInit() {

	}

	showNotification(): void {
		this.notificationService.registerNotification("Some nice notification message!");
	}

	showSpinner(): void {
		this.notificationService.showOverlay();
		setTimeout(() => this.notificationService.hideOverlay(), 3000);
	}
}
