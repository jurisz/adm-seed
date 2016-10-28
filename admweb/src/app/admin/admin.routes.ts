import {Routes} from "@angular/router";
import {AdminHomePage} from "./admin.home";
import {AdminBasePage} from "./admin.page";
import {AuthGuard} from "../service/auth.gurad";
import {Users} from "./user/user.list.component";

export const ROUTES: Routes = [
	{
		path: 'admin',
		component: AdminBasePage,
		canActivate: [AuthGuard],
		children: [
			{path: '', redirectTo: 'home', pathMatch: 'full'},
			{path: 'home', component: AdminHomePage},
			{path: 'users', component: Users},
			//USER_ROUTES
		]
	}
];