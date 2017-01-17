import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observer, Observable, Subscription} from "rxjs/Rx";
import {empty} from "rxjs/Observer";
import {Subject} from "rxjs/Subject";
import {NotificationsService} from "../components/notificaton/notification.service";

export class User {
	constructor(public isLoggedIn: boolean, public username: String, public permissions: String[]) {
	}

	public static emptyUser() {
		return new User(false, null, null);
	}
}

const LOGIN_SESSION_KEY = "login";

@Injectable()
export class UserService {
	public user = User.emptyUser();

	private userUpdatedSource = new Subject<User>();
	userUpdated$ = this.userUpdatedSource.asObservable();

	private loggedinPoller: Subscription;

	constructor(private http: Http, private notificationService: NotificationsService) {
	}

	public login(username: String, password: String, callbacks: Observer<any> = empty): void {
		this.http.post('/api/admin/login', {'name': username, 'password': password})
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.makeLogin(data, username);
					callbacks.next(data);
				},
				(error) => {
					this.resetUser();
					callbacks.error(error);
				}
			);

	}

	private makeLogin(permissions: any, username: String): void {
		this.user = new User(true, username, permissions);
		localStorage.setItem(LOGIN_SESSION_KEY, JSON.stringify(this.user));
		this.userUpdatedSource.next(this.user);
		this.startServerPooling();
	}

	private resetUser(): void {
		this.user = User.emptyUser();
		localStorage.removeItem(LOGIN_SESSION_KEY);
		if (this.loggedinPoller != null) {
			this.loggedinPoller.unsubscribe();
		}
		this.userUpdatedSource.next(this.user);
	}

	public isLoggedIn(): boolean {
		let sessionUser = localStorage[LOGIN_SESSION_KEY];
		let success = this.user.isLoggedIn || sessionUser;
		if (success && !this.user.isLoggedIn) {
			this.user = JSON.parse(localStorage.getItem(LOGIN_SESSION_KEY));
			this.userUpdatedSource.next(this.user);
			this.startServerPooling();
		}
		return success;
	}

	public logout(): void {
		this.resetUser();
		this.http.get('/api/admin/logout').subscribe();
	}

	private startServerPooling(): void {
		this.loggedinPoller = Observable.interval(25 * 1000)
			.switchMap(
				() => this.http.get('/api/admin/loggedin')
					.catch(error => {
						this.handleIsLoggedInAjaxError(error);
						return Observable.empty();
					})
			)
			.retry()
			.subscribe(
				(response: Response) => {
					if (response.text() == 'false' && this.user.isLoggedIn) {
						this.notificationService.registerError('sessionExpired');
					} else {
						this.notificationService.clearAllErrors();
					}
				}
			);
	}

	private handleIsLoggedInAjaxError(error) {
		if (error.status == 401 || error.status == 403) {
			this.notificationService.registerError('sessionExpired');
		} else if (error.status == 0 || error.status >= 404) {
			this.notificationService.registerError('connectionLost');
		}
	}
}