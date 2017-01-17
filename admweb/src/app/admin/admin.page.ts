import {Component, OnInit} from "@angular/core";
import {UserService, User} from "../service/user.service";
import {Router} from "@angular/router";

@Component({
	selector: 'page',
	styleUrls: [
		'./app.page.style.css'
	],
	template: `
<div id="admin">
	<nav class="navbar navbar-toggleable-md fixed-top navbar-light bg-faded">
		<a class="navbar-brand" [routerLink]=" ['./home'] "><i class="fa fa-home"></i> Backoffice</a>
		<div class="collapse navbar-collapse" id="navbar">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item dropdown">
					<a class="nav-link" data-toggle="dropdown" href="#" role="button">Dashboards</a>
					<div class="dropdown-menu">
						<a class="dropdown-item" [routerLink]=" ['./home'] ">Home</a>
						<a class="dropdown-item" [routerLink]=" ['./tasks-monitor'] ">Tasks</a>
						<a class="dropdown-item" [routerLink]=" ['./payments-import-export'] ">Payments import/export</a>
					</div>
				</li>
				<li class="nav-item dropdown">
					<a class="nav-link" data-toggle="dropdown" href="#" role="button">Registers</a>
					<div class="dropdown-menu">
						<a class="dropdown-item" [routerLink]=" ['./home'] ">Home</a>
						<a class="dropdown-item" [routerLink]=" ['./detail'] ">Detail link example</a>
						<a class="dropdown-item" [routerLink]=" ['./about'] ">About</a>
					</div>
				</li>
				<li class="nav-item dropdown">
					<a class="nav-link" data-toggle="dropdown" href="#" role="button">System</a>
					<div class="dropdown-menu">
						<a class="dropdown-item" [routerLink]=" ['./home'] ">test home</a>
						<a class="dropdown-item" [routerLink]=" ['./users'] ">Users</a>
						<a class="dropdown-item" [routerLink]=" ['./roles'] ">User roles</a>
						<a class="dropdown-item" [routerLink]=" ['./about'] ">About</a>
					</div>
				</li>
			</ul>
			<ul class="nav navbar-nav pull-right">
				<li class="nav-item"><a class="login-user"><i class="fa fa-user"></i> {{ user.username }}</a></li>
				<li class="nav-item"><a class="nav-link" href="#" (click)="logout()" role="button">Logout</a></li>
			</ul>
		</div>
	</nav>
</div>
<openviews></openviews>
<notifications></notifications>
<main>
  <router-outlet></router-outlet>
</main>
`
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