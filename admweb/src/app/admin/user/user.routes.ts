import {Routes} from "@angular/router";
import {Users} from "./user.list.component";
import {User} from "./user.edit.component";
import {Roles} from "./role.list.component";
import {Role} from "./role.edit.component";

export const USER_ROUTES: Routes = [
	{path: 'users', component: Users},
	{path: 'user/:id', component: User},
	{path: 'user-roles', component: Roles},
	{path: 'user-role/:id:', component: Role},
];