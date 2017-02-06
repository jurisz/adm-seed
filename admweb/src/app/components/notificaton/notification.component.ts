import {Component, OnInit} from "@angular/core";
import {NotificationsService, GlobalErrorType} from "../../service";

const NOTIFICATION_TIMEOUT = 4 * 1000;

class NotificationData {
	constructor(public id: Number, public message: String) {
	}
}

@Component({
	selector: 'notifications',
	// encapsulation: ViewEncapsulation.None,
	template: `
<div class="overlay" *ngIf="overlayEnabled">
	<div class="spinner">
		<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
	</div>
</div>

<div class="global-errors">
<div class="global-error fade-in alert alert-danger" *ngIf="globalErrors.has('sessionExpired')">
	<section>
			Session expired. <a href="" (click)="reloadPage()"><b>Click here to refresh</b></a>
	</section>
</div>
<div class="global-error fade-in alert alert-danger" *ngIf="globalErrors.has('connectionLost')">
	<section>
		Lost connection to the server
	</section>
</div>
</div>
<div class="global-notifications">
	<div class="alert alert-info" *ngFor="let notification of notifications" id="{{notification.id}}">
		{{notification.message}}	
	</div>
</div>
    `,
	styles: [`
.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    z-index: 99999;
}	
.spinner {
  top:48%;
  left: 48%;
  position:absolute;
}
.global-error {
  margin: 0 auto;
  padding: 15px;
  width: 500px;
  z-index: 200;
}
.global-notifications {
    width: 30%;
    position: absolute;
    right: 0;
    bottom: 100px;
    z-index: 201;
}
    `]
})
export class NotificationsComponent implements OnInit {

	globalErrors: Map<GlobalErrorType, boolean> = new Map();
	notificationsCounter = 0;
	notifications: NotificationData[] = [];
	overlayEnabled: boolean = false;

	constructor(private service: NotificationsService) {
	}

	ngOnInit(): void {
		this.service.errorsSender$.subscribe(error => {
			switch (error) {
				case 'clearAllErrors' :
					this.globalErrors.clear();
					break;
				case 'sessionExpired' :
					this.globalErrors.set('sessionExpired', true);
					break;
				case 'connectionLost' :
					this.globalErrors.set('connectionLost', true);
					break;
			}
		});

		this.service.notificationsSender$.subscribe(message => {
			let notificationId = this.notificationsCounter++;
			let notification = new NotificationData(notificationId, message);
			this.notifications.push(notification);
			setTimeout(() => this.clearNotification(notificationId), NOTIFICATION_TIMEOUT);
		});

		this.service.overlaySender$.subscribe(enabled => this.overlayEnabled = enabled)
	}

	private clearNotification(notificationId: number) {
		let index = this.notifications.findIndex(notification => notification.id === notificationId);
		this.notifications.splice(index, 1);
	}

	reloadPage(): void {
		window.location.reload(true);
	}
}
