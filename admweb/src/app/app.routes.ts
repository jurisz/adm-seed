import {Routes} from "@angular/router";
import {NoContent} from "./no-content";
import {Login} from "./login/login";

export const ROUTES: Routes = [
	{path: '', redirectTo: '/login', pathMatch: 'full'},
	{path: 'login', component: Login,},
    {path: '**', component: NoContent},
];
