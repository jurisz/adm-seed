import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Rx";
import {Response} from "@angular/http";

declare var $: any;

export type GlobalErrorType = 'clearAllErrors' | 'sessionExpired' | 'connectionLost';

export interface ConfirmDialogData {
	title: string;
	message: string;
	callBack: Function;
}

export interface ValidationError {
	property: string,
	errorCode: string
}

@Injectable()
export class NotificationsService {

	private errorsSender = new Subject<GlobalErrorType>();
	errorsSender$ = this.errorsSender.asObservable();

	private notificationsSender = new Subject<String>();
	notificationsSender$ = this.notificationsSender.asObservable();

	private overlaySender = new Subject<boolean>();
	overlaySender$ = this.overlaySender.asObservable();

	private errorDialogSender = new Subject<any>();
	errorDialogSender$ = this.errorDialogSender.asObservable();

	private confirmDialogSender = new Subject<ConfirmDialogData>();
	confirmDialogSender$ = this.confirmDialogSender.asObservable();


	public registerError(errorType: GlobalErrorType): void {
		this.errorsSender.next(errorType);
	}

	public clearAllErrors(): void {
		this.errorsSender.next('clearAllErrors')
	}

	public registerNotification(message: String): void {
		this.notificationsSender.next(message);
	}

	public showOverlay(): void {
		this.overlaySender.next(true);
	}

	public hideOverlay(): void {
		this.overlaySender.next(false);
	}

	public showHttpServerError(error: Response | any): void {
		this.errorDialogSender.next(error);
	}

	public showConfirmDialog(confirmDialogData: ConfirmDialogData): void {
		this.confirmDialogSender.next(confirmDialogData);
	}

	public clearFormErrorMessages(): void {
		$('.has-danger').removeClass('has-danger');
		$('.form-control-feedback').addClass('hidden');
	}

	public showFormErrorMessages(errors: ValidationError[]): void {
		errors.forEach(error => {
			var errorMsgEl = $('#' + error.property + '\\.' + error.errorCode.replace(/\./g, "\\."));
			errorMsgEl.removeClass("hidden");
			errorMsgEl.parent('div').parent('div').addClass("has-danger");
		});
	}

	public showFormOrServerErrors(error: Response | any) {
		if (error instanceof Response) {
			const errorJson = error.json() || '';
			if (errorJson.errors) {
				this.showFormErrorMessages(errorJson.errors);
				return;
			}
		}
		this.showHttpServerError(error);
	}
	
}