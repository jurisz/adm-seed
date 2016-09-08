import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observer} from "rxjs/Rx";
import {empty} from "rxjs/Observer";
import {Subject} from "rxjs/Subject";

export class User {
	constructor(public isLoggedIn: boolean, public username: String, public permissions: String[]) {
	}

	public static emptyUser() {
		return new User(false, null, null);
	}
}

@Injectable()
export class UserService {
	public user = User.emptyUser();

	private userUpdatedSource = new Subject<User>();

	userUpdated$ = this.userUpdatedSource.asObservable();
	
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
		this.userUpdatedSource.next(this.user);
    }

    private resetUser():void {
		this.user = User.emptyUser();
		this.userUpdatedSource.next(this.user);
    }

	public isLoggedIn(): boolean {
        return this.user.isLoggedIn;
    }
}