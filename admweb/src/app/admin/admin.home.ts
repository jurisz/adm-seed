import {Component} from "@angular/core";
import {NotificationsService} from "../service";

@Component({
	selector: 'home',
	template: `<h4>Welcome to admin area!</h4>

<h5>Temporary Show cases</h5>
<div>
    <button type="button" class="btn btn-success" (click)="showNotification()">Notification</button>
    <button type="button" class="btn btn-success" (click)="showSpinner()">Overlay show</button>
    <button type="button" class="btn btn-success" (click)="showErrorDialogSample()">Show error dialog sample</button>
    <button type="button" class="btn btn-success" (click)="showConfirmDialogSample()">Show confirm dialog sample</button>
</div>
`
})
export class AdminHomePage {

	constructor(private notificationService: NotificationsService) {
	}

	showNotification(): void {
		this.notificationService.registerNotification('Some nice notification message!');
	}

	showSpinner(): void {
		this.notificationService.showOverlay();
		setTimeout(() => this.notificationService.hideOverlay(), 3000);
	}

	showErrorDialogSample(): void {
		this.notificationService.showHttpServerError('Server error happened!');
	}

	showConfirmDialogSample(): void {
		let confirmDialogData = {title: 'Delete', message: 'Are you sure want to delete', callBack: this.doConfirmDialogDelete}
		this.notificationService.showConfirmDialog(confirmDialogData);
	}

	private doConfirmDialogDelete() {
		console.log("Record deleted");
	}
}
