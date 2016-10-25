/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from "@angular/core";
import {UserService, User} from "./service/user.service";

/*
 * App Component
 * Top Level Component
 */
@Component({
	selector: 'app',
	encapsulation: ViewEncapsulation.None,
	template: `
<main>
  <router-outlet></router-outlet>
</main>
`
})
export class App {
	user = User.emptyUser();

	constructor(public userService: UserService) {
	}

	ngOnInit() {
		this.userService.userUpdated$.subscribe(user=> {
			this.user = user;
		});
	}
}

