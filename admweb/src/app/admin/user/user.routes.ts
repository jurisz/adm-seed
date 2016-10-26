import {Routes} from "@angular/router";
import {Users} from "./user.list.component";
import {User} from "./user.edit.component";
import {Roles} from "./role.list.component";
import {Role} from "./role.edit.component";

export const ROUTES: Routes = [
	{path: 'users', component: Users},
	{path: 'user/:id', component: User},
	{path: 'roles:', component: Roles},
	{path: 'role/:id:', component: Role},
];