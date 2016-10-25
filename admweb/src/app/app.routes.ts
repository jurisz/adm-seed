import {Routes} from "@angular/router";
import {AdminPage} from "./admin/admin.page";
import {NoContent} from "./no-content";
import {Login} from "./login/login";
import {AuthGuard} from "./service/auth.gurad";

export const ROUTES: Routes = [
	{path: '', redirectTo: '/login', pathMatch: 'full'},
	{path: 'login', component: Login,},
	{path: 'admin', component: AdminPage, canActivate: [AuthGuard]},
    {path: '**', component: NoContent},
];
