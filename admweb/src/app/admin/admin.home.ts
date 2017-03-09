import {Component} from "@angular/core";
import {NotificationsService, CommonDialogsService} from "../service";

@Component({
	selector: 'home',
	template: `<h4>Welcome to admin area!</h4>

<h5>Temporary Show cases</h5>
<div>
    <button type="button" class="btn btn-success" (click)="showNotification()">Notification</button>
    <button type="button" class="btn btn-success" (click)="showSpinner()">Overlay show</button>
    <button type="button" class="btn btn-success" (click)="showErrorDialogSample()">Show error dialog sample</button>
</div>
`
})
export class AdminHomePage {

	constructor(private notificationService: NotificationsService, private commonDialogService: CommonDialogsService) {
	}

	showNotification(): void {
		this.notificationService.registerNotification("Some nice notification message!");
	}

	showSpinner(): void {
		this.notificationService.showOverlay();
		setTimeout(() => this.notificationService.hideOverlay(), 3000);
	}

	showErrorDialogSample(): void {
		this.commonDialogService.showHttpServerError("Server error happened!");
	}
}
