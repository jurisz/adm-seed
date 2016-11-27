import {Component, OnInit} from "@angular/core";
import {NotificationsService, GlobalErrorType} from "./notification.service";

@Component({
	selector: 'notifications',
	// encapsulation: ViewEncapsulation.None,
	template: `
<div class="global-errors">
<div class="global-error fade-in alert alert-danger" *ngIf="globalErrors.has('sessionExpired')">
	<section>
			Session expired. <a href="" (click)="reloadPage()"><b>Click here to refresh</b></a>
	</section>
</div>
<div class="global-error fade-in alert alert-danger" *ngIf="globalErrors.has('connectionLost')">
	<section>
		Lost connection to the server
	</section>
</div>
</div>
    `,
	styles: [`
.global-errors{
  margin-top: 60px;
}
.global-error {
  margin: 0 auto;
  padding: 15px;
  width: 500px;
  z-index: 200;
}
    `]
})

export class NotificationsComponent implements OnInit {

	globalErrors: Map<GlobalErrorType, boolean> = new Map();

	constructor(private service: NotificationsService) {
	}

	ngOnInit(): void {
		this.service.errorsSender$.subscribe(error => {
			switch (error) {
				case 'clearAllErrors' :
					this.globalErrors.clear();
					break;
				case 'sessionExpired' :
					this.globalErrors.set('sessionExpired', true);
					break;
				case 'connectionLost' :
					this.globalErrors.set('connectionLost', true);
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
