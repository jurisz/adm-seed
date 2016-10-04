import {Routes} from "@angular/router";
import {Home} from "./home";
import {About} from "./about";
import {NoContent} from "./no-content";
import {Login} from "./component/login";
import {AuthGuard} from "./service/auth.gurad";

export const ROUTES: Routes = [
    {path: '', component: Home},
    {path: 'home', component: Home},
	{path: 'about', component: About, canActivate: [AuthGuard]},
    {
		path: 'detail', loadChildren: () => System.import('./+detail')
    },
    {path: 'login', component: Login},
    {path: '**', component: NoContent},
];
