import {ApplicationRef, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {createNewHosts, removeNgStyles} from "@angularclass/hmr";
import {ENV_PROVIDERS} from "./environment";
import {ROUTES} from "./app.routes";
import {App} from "./app.component";
import {NoContent} from "./no-content";
import {Login} from "./login/login";
import {AdminModule} from "./admin/admin.module";
import {AuthGuard} from "./service/auth.gurad";
import {AppStoredState, NotificationsService, UserService, ViewTabsService} from "./service";

// App is our top level component

// Application wide providers
const APP_PROVIDERS = [
	AppStoredState,
	AuthGuard,
	UserService,
	NotificationsService,
	ViewTabsService
];

@NgModule({
	bootstrap: [App],
	declarations: [
		App,
		Login,
		NoContent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(ROUTES, {useHash: true}),
		AdminModule
	],
	providers: [
		ENV_PROVIDERS,
		APP_PROVIDERS
	]
})
export class AppModule {
	constructor(public appRef: ApplicationRef) {
	}

	hmrOnInit(store) {
		if (!store || !store.state) return;
		console.log('HMR store', store);
		delete store.state;
	}

	hmrOnDestroy(store) {
		// recreate elements
		var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
		store.disposeOldHosts = createNewHosts(cmpLocation)
		// remove styles
		removeNgStyles();
	}

	hmrAfterDestroy(store) {
		// display new elements
		store.disposeOldHosts();
		delete store.disposeOldHosts;
	}
}
