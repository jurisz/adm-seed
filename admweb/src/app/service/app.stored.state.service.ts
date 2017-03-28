import {Injectable} from "@angular/core";


@Injectable()
export class AppStoredState {

	private storedData: Map<String, any> = new Map();

	public store(key: String, data: any): void {
		this.storedData.set(key, data);
	}

	public get(key: String): any {
		return this.storedData.get(key);
	}
}
