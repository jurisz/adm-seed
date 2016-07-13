import {Component} from "@angular/core";
import {Router, ROUTER_DIRECTIVES} from "@angular/router";
import {CORE_DIRECTIVES} from "@angular/common";
import {UserService} from "../service";

const styles = require('./login.css');
const template = require('./login.html');

@Component({
    selector: 'login',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES],
    template: template,
    styles: [styles],
    providers: [UserService]
})
export class Login {
    private model = {username: null, password: null};
    private loginFailed = false;

    constructor(private userService:UserService, private router:Router) {
    }

    public login(event:KeyboardEvent) {
        this.loginFailed = false;
        if (event !== undefined && event.keyCode !== 13) {
            return;
        }

        this.userService.login(this.model.username, this.model.password).subscribe(
            (data) => this.router.navigate(["home"]),
            (err) => this.showLoginError()
        );
    }

    private showLoginError() {
        this.loginFailed = true;
    }
}