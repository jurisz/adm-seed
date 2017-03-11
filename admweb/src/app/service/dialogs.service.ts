import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Rx";
import {Response} from "@angular/http";

export interface ConfirmDialogData {
	title: string;
	message: string;
	callBack: Function;
}

@Injectable()
export class CommonDialogsService {

	private errorDialogSender = new Subject<any>();
	errorDialogSender$ = this.errorDialogSender.asObservable();

	private confirmDialogSender = new Subject<ConfirmDialogData>();
	confirmDialogSender$ = this.confirmDialogSender.asObservable();

	public showHttpServerError(error: Response|any): void {
		this.errorDialogSender.next(error);
	}

	public showConfirmDialog(confirmDialogData: ConfirmDialogData): void {
		this.confirmDialogSender.next(confirmDialogData);
	}
}
