import {Component, OnInit} from "@angular/core";
import {UserService, User} from "../service/user.service";

@Component({
	selector: 'page',
	styleUrls: [
		'./app.page.style.css'
	],
	template: `
<div id="admin">
	<nav class="navbar navbar-fixed-top navbar-light bg-faded">
    	<div class="container-fluid">
            <button class="navbar-toggler hidden-md-up" type="button" data-toggle="collapse" data-target="#navbar">
                &#9776;
            </button>
            <a class="navbar-brand" [routerLink]=" ['./'] "><i class="fa fa-home"></i> Backoffice</a>
            <div class="collapse navbar-toggleable-sm" id="navbar">
                <ul class="nav navbar-nav">
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
                            <a class="dropdown-item" [routerLink]=" ['./users'] ">Users</a>
                            <a class="dropdown-item" [routerLink]=" ['./roles'] ">User roles</a>
                            <a class="dropdown-item" [routerLink]=" ['./about'] ">About</a>
                        </div>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right pull-xs-right">
                	<li class="nav-item">{{ user.username }}</li>
                    <li class="nav-item"><a class="nav-link" [routerLink]=" ['./login'] ">Login</a></li>
                </ul>
            </div>
        </div>
	</nav>
</div>

<main>
  <router-outlet></router-outlet>
</main>
`
})
export class AdminPage implements OnInit {
	user = User.emptyUser();

	constructor(public userService: UserService) {
	}

	ngOnInit(): void {
		this.userService.userUpdated$.subscribe(user=> {
			this.user = user;
		});
	}
}