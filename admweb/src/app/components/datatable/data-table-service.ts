import {Injectable} from "@angular/core";
import {AppStoredState} from "../../service";
import {EntityPageQuery} from "./data-table";

const QUERY_KEY = 'entity-query';

@Injectable()
export class DataTableService {

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
}
