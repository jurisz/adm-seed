import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {Response} from "@angular/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

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
						<button type="button" class="btn btn-secondary" (click)="showFullError()" *ngIf="errorDialogData.fullErrorText && !fullErrorVisible">Details ></button>
				</div>
				<div class="modal-body error-details-scrollable" *ngIf="fullErrorVisible">
				<hr>
					<samp [innerHtml]="sanitize(errorDialogData.fullErrorText)"></samp>
				</div>
			</div>
		</div>
	</div>
`,
	styles: [`
	.error-details-scrollable {
		overflow: auto;
 }
`]
})
export class ErrorDialog {

	@ViewChild('errorDialog')
	errorDialogModal: ViewContainerRef;

	errorDialogData: ErrorDialogData;

	fullErrorVisible = false;

	public constructor(private sanitizer: DomSanitizer) {
	}

	public showErrorDialog(errorData: Response | any): void {
		if (errorData instanceof Response) {
			let httpError = <Response> errorData;
			this.errorDialogData = {
				errorMessage: httpError.statusText + ": " + httpError.status,
				fullErrorText: httpError.text()
			}
		} else {
			this.errorDialogData = {
				errorMessage: errorData,
				fullErrorText: undefined
			}
		}

		$(this.errorDialogModal.nativeElement).modal('show');
	}

	public removeDialog(): void {
		let nativeElement = this.errorDialogModal.nativeElement;
		$(nativeElement).modal('hide');
		nativeElement.remove();
	}

	public sanitize(html: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(html);
	}

	public showFullError() {
		this.fullErrorVisible = true;
	}
}
