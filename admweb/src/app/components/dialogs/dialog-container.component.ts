import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {ErrorDialog} from "./error.dialog";
import {ConfirmDialogData, NotificationsService} from "../../service/notification.service";
import {Response} from "@angular/http";
import {ConfirmDialog} from "./confirm.dialog";

@Component({
	selector: 'dialog-container',
	entryComponents: [ErrorDialog, ConfirmDialog],
	template: `<div #dialogContainer></div>`
})
export class DialogContainer implements OnInit {

	@ViewChild('dialogContainer', {read: ViewContainerRef})
	dialogContainer: ViewContainerRef;

	private currentDialog = null;

	constructor(private notificationService: NotificationsService,
				private componentFactoryResolver: ComponentFactoryResolver) {
	}

	ngOnInit(): void {
		this.notificationService.errorDialogSender$.subscribe(errorData => this.showErrorDialog(errorData));
		this.notificationService.confirmDialogSender$.subscribe(data => this.showConfirmDialog(data));
	}

	private showErrorDialog(errorData: Response | any): void {
		let factory = this.componentFactoryResolver.resolveComponentFactory(ErrorDialog);
		let dialog = this.dialogContainer.createComponent(factory);
		dialog.instance.showErrorDialog(errorData);
		this.removeAndStoreCurrentDialogReference(dialog);
	}

	private showConfirmDialog(confirmDialogData: ConfirmDialogData): void {
		let factory = this.componentFactoryResolver.resolveComponentFactory(ConfirmDialog);
		let dialog = this.dialogContainer.createComponent(factory);
		dialog.instance.showDialog(confirmDialogData);
		this.removeAndStoreCurrentDialogReference(dialog);
	}

	private removeAndStoreCurrentDialogReference(dialog: any) {
		if (this.currentDialog) {
			this.currentDialog.destroy();
		}
		this.currentDialog = dialog;
	}
}
