import {Routes, Route} from "@angular/router";
import {AdminHomePage} from "./admin.home";
import {AdminBasePage} from "./admin.page";
import {AuthGuard} from "../service/auth.gurad";
import {About} from "./about/about.component";
import {USER_MODULE_ROUTES} from "./user/user.routes";

const GENERAL_ADMIN_ROUTES: Route[] = [
	{path: '', redirectTo: 'home', pathMatch: 'full'},
	{path: 'home', component: AdminHomePage},
	{path: 'about', component: About}
];

export const ROUTES: Routes = [
	{
		path: 'admin',
		component: AdminBasePage,
		canActivate: [AuthGuard],
		children: GENERAL_ADMIN_ROUTES
			.concat(USER_MODULE_ROUTES)
	}
];