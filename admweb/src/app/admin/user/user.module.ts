import {NgModule} from "@angular/core";
import {Users} from "./user.list.component";
import {User} from "./user.edit.component";
import {Roles} from "./role.list.component";
import {Role} from "./role.edit.component";
import {SharedModule} from "../../components/shared.module";

@NgModule({
	imports: [
		SharedModule
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