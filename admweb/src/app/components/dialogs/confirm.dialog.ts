import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {ConfirmDialogData} from "../../service/dialogs.service";

declare var $: any;

@Component({
	selector: 'confirm-dialog',
	template: `<div class="modal fade" #confirmDialog data-backdrop="false">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{confirmDialogData.title}}</h5>
					<button type="button" class="close" aria-label="Close" (click)="removeDialog()">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<p>{{confirmDialogData.message}}</p>
				</div>
				<div class="modal-footer">
						<button type="button" class="btn btn-primary" (click)="doAction()">Ok</button>
					 <button type="button" class="btn btn-secondary" (click)="removeDialog()">Cancel</button>
				</div>
			</div>
		</div>
	</div>
`
})
export class ConfirmDialog {

	@ViewChild('confirmDialog')
	dialogRef: ViewContainerRef;

	confirmDialogData: ConfirmDialogData;

	public constructor() {
	}

	public showDialog(confirmDialogData: ConfirmDialogData): void {
		this.confirmDialogData = confirmDialogData;
		$(this.dialogRef.nativeElement).modal('show');
	}

	public doAction(): void {
		this.confirmDialogData.callBack();
		this.removeDialog();
	}

	public removeDialog(): void {
		let nativeElement = this.dialogRef.nativeElement;
		$(nativeElement).modal('hide');
		nativeElement.remove();
	}
}
