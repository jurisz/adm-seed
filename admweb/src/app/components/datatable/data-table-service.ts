import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Rx";
import {AppStoredState} from "../../service";
import {EntityPageQuery} from "./data-table";

const QUERY_KEY = '-entity-query';

@Injectable()
export class DataTableService {

	private filtersResetSender = new Subject<void>();
	filtersResetSender$ = this.filtersResetSender.asObservable();
	
	constructor(private appStoredState: AppStoredState) {
	}

	public storeEntityPageQuery(query: EntityPageQuery): void {
		let storeKey = window.location.pathname + QUERY_KEY;
		this.appStoredState.store(storeKey, query);
	}

	public readEntityPageQuery(): EntityPageQuery {
		let storeKey = window.location.pathname + QUERY_KEY;
		return this.appStoredState.get(storeKey);
	}

	public resetAllPageFilters() {
		this.filtersResetSender.next();
	}
}
