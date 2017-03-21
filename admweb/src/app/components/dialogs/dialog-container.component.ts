import {Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver} from "@angular/core";
import {ErrorDialog} from "./error.dialog";
import {CommonDialogsService, ConfirmDialogData} from "../../service/dialogs.service";
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

	constructor(private dialogService: CommonDialogsService,
				private componentFactoryResolver: ComponentFactoryResolver) {
	}

	ngOnInit(): void {
		this.dialogService.errorDialogSender$.subscribe(errorData => this.showErrorDialog(errorData));
		this.dialogService.confirmDialogSender$.subscribe(data => this.showConfirmDialog(data));
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
