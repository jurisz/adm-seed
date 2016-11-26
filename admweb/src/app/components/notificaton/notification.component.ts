import {Component, ViewEncapsulation, OnInit} from "@angular/core";
import {NotificationsService, GlobalErrorType} from "./notification.service";
// import {Subscription} from 'rxjs/Subscription';

@Component({
	selector: 'notifications',
	encapsulation: ViewEncapsulation.None,
	template: `
<div class="global-error fade-in alert alert-danger" *ngIf="globalErrors.indexOf('sessionExpired') > -1">
	<section>
			Session expired. <a href="" (click)="reloadPage()"><b>Click here to refresh</b></a>
	</section>
</div>
<div class="global-error fade-in alert alert-danger" *ngIf="globalErrors.indexOf('connectionLost) > -1">
	<section>
		Lost connection to the server
	</section>
</div>
    `,
	styles: [`
 .global-error {
    margin: 0 auto;
    padding: 15px;
    width: 500px;
    z-index: 200;
}

    `]
})

export class NotificationsComponent implements OnInit {

	globalErrors: GlobalErrorType[] = [];

	constructor(private service: NotificationsService) {
	}

	ngOnInit(): void {
		this.service.errorsSender$.subscribe(error => {
			switch (error) {
				case 'clearAllErrors' :
					this.globalErrors = [];
					break;
				case 'sessionExpired' :
					this.globalErrors.push('sessionExpired');
					break;
				case 'connectionLost' :
					this.globalErrors.push('connectionLost');
					break;
			}
		});

		this.service.notificationsSender$.subscribe(message => {
			//TODO
		});
	}

	reloadPage(): void {
		window.location.reload(true);
	}
}
