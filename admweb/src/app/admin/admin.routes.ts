import {Routes} from "@angular/router";
import {AdminHomePage} from "./admin.home";
import {AdminBasePage} from "./admin.page";
import {AuthGuard} from "../service/auth.gurad";
import {About} from "./about/about.component";
import {USER_ROUTES} from "./user/user.routes";

export const ROUTES: Routes = [
	{
		path: 'admin',
		component: AdminBasePage,
		canActivate: [AuthGuard],
		children: [
			{path: '', redirectTo: 'home', pathMatch: 'full'},
			{path: 'home', component: AdminHomePage},
			{path: 'about', component: About}
		].concat(USER_ROUTES)
	}
];