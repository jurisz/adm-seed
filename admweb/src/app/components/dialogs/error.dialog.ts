import {Component, ViewChild, ViewContainerRef} from "@angular/core";

declare var $: any;

export interface ErrorDialogData {
	errorMessage: string;
	fullErrorText: string;
}

@Component({
	selector: 'error-dialog',
	template: `<div class="modal fade" #errorDialog data-backdrop="false">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Error</h5>
					<button type="button" class="close" aria-label="Close" (click)="removeDialog()">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<p>{{errorDialogData?.errorMessage}}</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" (click)="removeDialog()">Close</button>
				</div>
			</div>
		</div>
	</div>
`
})
export class ErrorDialog {

	@ViewChild('errorDialog')
	errorDialogModal: ViewContainerRef;

	errorDialogData: ErrorDialogData;

	public showErrorDialog(errorDialogData: ErrorDialogData): void {
		this.errorDialogData = errorDialogData;
		$(this.errorDialogModal.nativeElement).modal('show');
	}

	public removeDialog(): void {
		$(this.errorDialogModal.nativeElement).modal('hide');
		this.errorDialogModal.nativeElement.remove();
	}
}
