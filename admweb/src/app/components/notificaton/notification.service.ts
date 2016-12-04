import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Rx";

export type GlobalErrorType = 'clearAllErrors' | 'sessionExpired' | 'connectionLost';

@Injectable()
export class NotificationsService {

	private errorsSender = new Subject<GlobalErrorType>();
	errorsSender$ = this.errorsSender.asObservable();

	private notificationsSender = new Subject<String>();
	notificationsSender$ = this.notificationsSender.asObservable();

	private overlaySender = new Subject<boolean>();
	overlaySender$ = this.overlaySender.asObservable();
	
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
}