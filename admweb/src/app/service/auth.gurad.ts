import {Injectable} from "@angular/core";
import {Router, CanActivate, ActivatedRouteSnapshot} from "@angular/router";
import {UserService} from "../service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private userService: UserService) {
	}

	canActivate(route: ActivatedRouteSnapshot) {
		if (this.userService.isLoggedIn()) {
			return true;
		}

		let protectedUrl: String = location.pathname;
		this.router.navigate(['/login', {nextUrl: protectedUrl}]);
		return false;
	}
}