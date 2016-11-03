import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observer, Observable, Subscription} from "rxjs/Rx";
import {empty} from "rxjs/Observer";
import {Subject} from "rxjs/Subject";

export class User {
	constructor(public isLoggedIn: boolean, public username: String, public permissions: String[]) {
	}

	public static emptyUser() {
		return new User(false, null, null);
	}
}

const LOGIN_SESSION_KEY = "loggedIn";

@Injectable()
export class UserService {
	public user = User.emptyUser();

	private userUpdatedSource = new Subject<User>();
	userUpdated$ = this.userUpdatedSource.asObservable();
	private sessionErrorsSource = new Subject<String>();
	sessionErrors$ = this.sessionErrorsSource.asObservable();

	private loggedinPoller: Subscription;
	
    constructor(public http:Http) {
    }

	public login(username: String, password: String, callbacks: Observer<any> = empty): void {
		this.http.post('/api/admin/login', {'name': username, 'password': password})
			.map(res=> res.json())
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

	private makeLogin(permissions:any, username:String):void {
		this.user = new User(true, username, permissions);
		sessionStorage.setItem(LOGIN_SESSION_KEY, "true");
		this.userUpdatedSource.next(this.user);
		this.startServerPooling();
    }

    private resetUser():void {
		this.user = User.emptyUser();
		sessionStorage.removeItem(LOGIN_SESSION_KEY)
		if (this.loggedinPoller != null) {
			this.loggedinPoller.unsubscribe();
		}
		this.userUpdatedSource.next(this.user);
    }

	public isLoggedIn(): boolean {
		var success = this.user.isLoggedIn || sessionStorage[LOGIN_SESSION_KEY];
		if (success && !this.user.isLoggedIn) {
			this.startServerPooling()
		}
		return success;
    }

	public logout() {
		this.resetUser();
		this.http.get('/logout').subscribe();
	}

	private startServerPooling() {
		this.loggedinPoller = Observable.interval(5 * 1000)
			.switchMap(() => this.http.get('/api/admin/loggedin'))
			.subscribe(
				(response: Response) => {
					if (response.text() == 'false' && this.user.isLoggedIn) {
						this.reportError('sessionExpired');
					}
				},
				(error) => {
					if (error.status == 401 || error.status == 403) {
						this.reportError('sessionExpired');
					} else if (error.status == 0 || error.status >= 404) {
						this.reportError('connectionLost');
					}

				}
			);
	}

	private reportError(errorMsg: string) {
		this.sessionErrorsSource.next(errorMsg);
	}
}