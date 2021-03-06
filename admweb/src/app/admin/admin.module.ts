import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {AdminBasePage} from "./admin.page";
import {AdminHomePage} from "./admin.home";
import {About} from "./about/about.component";
import {UserModule} from "./user/user.module";
import {ROUTES} from "./admin.routes";
import {SharedModule} from "../components/shared.module";
import {NotificationsComponent} from "../components/notificaton/notification.component";
import {OpenViewTabsComponent} from "../components/viewtabs/viewtabs.component";

@NgModule({
	imports: [
		SharedModule,
		UserModule,
		RouterModule.forChild(ROUTES)
	],
	declarations: [
		AdminBasePage,
		AdminHomePage,
		About,
		NotificationsComponent,
		OpenViewTabsComponent,
	]
})
export class AdminModule {
}
