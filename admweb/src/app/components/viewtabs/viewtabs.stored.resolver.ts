import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";


@Injectable()
class ViewTabsStoredDataResolver implements Resolve<any> {

	//Liekas, ka šo nevajag
	//Visur ir parasti resolveri, injectejam kopējo ViewTabsStoredDataService...
	//service paskatās vai ir dati, ja ir tad padod tos, ja nē tad lādējam no backend 

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
		let id = route.params['id'];
		// route.url.
		//
		return undefined;
	}

	// resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<T>|Promise<T>|T

}