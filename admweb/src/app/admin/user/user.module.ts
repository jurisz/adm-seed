import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Users} from "./user.list.component";
import {User} from "./user.edit.component";
import {Roles} from "./role.list.component";
import {Role} from "./role.edit.component";

@NgModule({
	imports: [
		CommonModule
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