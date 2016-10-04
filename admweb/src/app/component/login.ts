import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {Subscriber} from "rxjs/Rx";
import {UserService} from "../service";

@Component({
	selector: 'login',
	templateUrl: './login.html',
})
export class Login {
	private model = {username: null, password: null};
	private loginFailed = false;

	constructor(private userService: UserService, private router: Router) {
	}

	public login(event: KeyboardEvent) {
		this.loginFailed = false;
		if (event !== undefined && event.keyCode !== 13) {
			return;
		}
		let callbacks = Subscriber.create(
			(data) => this.router.navigate(["home"]),
			(err) => this.showLoginError()
		);
		this.userService.login(this.model.username, this.model.password, callbacks);
	}

	private showLoginError() {
		this.loginFailed = true;
	}
}