import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {Users} from "./user.list.component";
import {User} from "./user.edit.component";
import {Roles} from "./role.list.component";
import {Role} from "./role.edit.component";
import {ROUTES} from "./user.routes";

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES)
	],
	declarations: [
		Users,
		User,
		Role,
		Roles,
	]
})
export class UserModule {
}