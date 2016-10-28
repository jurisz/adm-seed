import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscriber} from "rxjs/Rx";
import {UserService} from "../service";

@Component({
	selector: 'login',
	templateUrl: './login.html',
})
export class Login {
	private model = {username: null, password: null};
	private loginFailed = false;

	constructor(private userService: UserService, private router: Router, private activeRoute: ActivatedRoute) {
	}

	public login(event: KeyboardEvent) {
		this.loginFailed = false;
		if (event !== undefined && event.keyCode !== 13) {
			return;
		}
		let callbacks = Subscriber.create(
			(data) => this.loginSuccess(),
			(err) => this.showLoginError()
		);
		this.userService.login(this.model.username, this.model.password, callbacks);
	}

	private showLoginError() {
		this.loginFailed = true;
	}

	private loginSuccess() {
		this.activeRoute.params.subscribe(
			params => {
				let nextUrl: string = params['nextUrl'];
				if (nextUrl) {
					location.pathname = nextUrl;
				} else {
					this.router.navigate(["/admin"]);
				}
			}
		);
	}
}