import {Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver} from "@angular/core";
import {ErrorDialog} from "./error.dialog";
import {CommonDialogsService} from "../../service/dialogs.service";
import {Response} from "@angular/http";

@Component({
	selector: 'dialog-container',
	entryComponents: [ErrorDialog],
	template: `<div #dialogContainer></div>`
})
export class DialogContainer implements OnInit {

	private currentDialog = null;

	@ViewChild('dialogContainer', {read: ViewContainerRef})
	dialogContainer: ViewContainerRef;

	constructor(private dialogService: CommonDialogsService,
													private componentFactoryResolver: ComponentFactoryResolver) {
	}

	ngOnInit(): void {
		this.dialogService.errorDialogSender$.subscribe(errorData => this.showErrorDialog(errorData))
	}

	public showErrorDialog(errorData: Response | any): void {

		if (this.currentDialog) {
			this.currentDialog.destroy();
		}

		let factory = this.componentFactoryResolver.resolveComponentFactory(ErrorDialog);
		let dialog = this.dialogContainer.createComponent(factory);

		this.currentDialog = dialog;
		dialog.instance.showErrorDialog(errorData);
	}
}
