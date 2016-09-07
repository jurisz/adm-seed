import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observer} from "rxjs/Rx";
import {empty} from "rxjs/Observer";

export class User {
	constructor(public isLoggedIn: boolean, username: String, permissions: String[]) {
	}
}

@Injectable()
export class UserService {
	private user = new User(false, null, null);

    constructor(public http:Http) {
    }

	public login(username: String, password: String, callbacks: Observer<any> = empty): void {
        let loginObservable = this.http.post('/api/admin/login', {'name': username, 'password': password})
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
    }

    private resetUser():void {
		this.user = new User(false, null, null);
    }

    private isLoggedIn():boolean {
        return this.user.isLoggedIn;
    }
}