import {Routes} from "@angular/router";
import {AdminHomePage} from "./admin.home";

export const ROUTES: Routes = [
	{path: '', redirectTo: 'home', pathMatch: 'full'},
	{path: 'home', component: AdminHomePage},
];