import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Rx";
import {Response} from "@angular/http";


@Injectable()
export class CommonDialogsService {

	private errorDialogSender = new Subject<any>();
	errorDialogSender$ = this.errorDialogSender.asObservable();

	public showHttpServerError(error: Response|any): void {
		this.errorDialogSender.next(error);
	}

}
