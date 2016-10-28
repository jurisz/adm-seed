import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {AdminBasePage} from "./admin.page";
import {AdminHomePage} from "./admin.home";
import {About} from "./about/about.component";
import {UserModule} from "./user/user.module";
import {ROUTES} from "./admin.routes";

@NgModule({
	imports: [
		CommonModule,
		UserModule,
		RouterModule.forChild(ROUTES)
	],
	declarations: [
		AdminBasePage,
		AdminHomePage,
		About,
	]
})
export class AdminModule {
}