import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";

@Injectable()
export class UserService {
    private user = {isLoggedIn: false, username: null, permissions: null};

    constructor(public http:Http) {
    }

    public login(username:String, password:String):Observable<Response> {
        let loginObservable = this.http.post('/api/admin/login', {'name': username, 'password': password})
            .map(res=> res.json());

        loginObservable.subscribe(
            (data) => this.makeLogin(data, username),
            (err) => this.resetUser()
        );

        return loginObservable;
    }

    private makeLogin(permissions:any, username:String):void {
        this.user = {isLoggedIn: true, username: username, permissions: permissions};
    }

    private resetUser():void {
        this.user = {isLoggedIn: false, username: null, permissions: null};
    }

    private isLoggedIn():boolean {
        return this.user.isLoggedIn;
    }
}