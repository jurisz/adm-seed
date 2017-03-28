import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Rx";

@Injectable()
export class ViewTabsService {

	private closeViewSender = new Subject<String>();
	closeViewSender$ = this.closeViewSender.asObservable();

	public closeViewByTitle(title: string): void {
		this.closeViewSender.next(title);
	}
}