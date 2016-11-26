import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Subject} from "rxjs/Rx";

export type GlobalErrorType = 'clearAllErrors' | 'sessionExpired' | 'connectionLost';

@Injectable()
export class NotificationsService {

	private errorsSender = new Subject<GlobalErrorType>();
	errorsSender$ = this.errorsSender.asObservable();

	private notificationsSender = new Subject<String>();
	notificationsSender$ = this.notificationsSender.asObservable();

	constructor(public http: Http) {
	}

	public registerError(errorType: GlobalErrorType): void {
		this.errorsSender.next(errorType);
	}

	public clearAllErrors(): void {
		this.errorsSender.next('clearAllErrors')
	}

	public registerNotification(message: String): void {
		this.notificationsSender.next(message);
	}
}