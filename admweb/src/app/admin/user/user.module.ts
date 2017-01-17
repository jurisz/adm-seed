import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Users} from "./user.list.component";
import {User} from "./user.edit.component";
import {Roles} from "./role.list.component";
import {Role} from "./role.edit.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";

@NgModule({
	imports: [
		CommonModule,
		NgxDatatableModule
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