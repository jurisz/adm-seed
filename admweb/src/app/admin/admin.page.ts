import {Component, OnInit} from "@angular/core";
import {UserService, User} from "../service/user.service";
import {Router} from "@angular/router";

@Component({
	selector: 'page',
	styleUrls: ['./app.page.style.css'],
	templateUrl: './admin.page.html'
})
export class AdminBasePage implements OnInit {
	user = User.emptyUser();

	constructor(private userService: UserService, private router: Router) {
		this.user = userService.user;
	}

	ngOnInit(): void {
		this.userService.userUpdated$.subscribe(user => {
			this.user = user;
		});
	}

	logout(): void {
		this.userService.logout();
		this.router.navigate(["/login"]);
	}
}