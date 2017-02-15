import {Component, OnInit} from "@angular/core";
import {Router, Event, NavigationEnd, ActivatedRoute} from "@angular/router";

const MAX_OPEN_VIEWS = 12;

interface ViewTabData {
	activationId: number;
	title: string;
	url: string;
	active: boolean;
}

@Component({
	selector: 'openviews',
	template: `
<ul class="nav nav-tabs openview-nav">
  <li class="nav-item" *ngFor="let view of openViewTabs">
  	<a class="nav-link" [ngClass]="{'active': view.active}" [href]="view.url">{{view.title}}</a> 
  </li>	
</ul>
    `,
	styles: [`
.openview-nav {
	margin-top: 45px;
}
	
    `]
})
export class OpenViewTabsComponent implements OnInit {

	private viewActivateCounter = 0;
	private openViewTabs: ViewTabData[] = [];

	constructor(private router: Router, private activeRoute: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.router.events.subscribe(
			event => {
				this.processSuccessEvent(event);
			},
			error => {
				console.log("routing error: " + error);
			}
		);
	}

	private processSuccessEvent(event: Event) {
		if (event instanceof NavigationEnd) {
			let viewTitle = this.extractViewTitle();
			if (viewTitle) {
				this.addOrActivateTitle(viewTitle);
				console.log('view: ' + viewTitle + ' url: ' + this.activeRoute.snapshot.url.join(''));
				this.removeLastExtraTab();
			}
		}
	}

	private addOrActivateTitle(viewTitle: string) {
		this.viewActivateCounter++;
		let tabExists = false;
		for (let tab of this.openViewTabs) {
			if (tab.title == viewTitle) {
				tabExists = true;
				tab.activationId = this.viewActivateCounter;
				tab.active = true;
			} else {
				tab.active = false;
			}
		}

		if (!tabExists) {
			this.openViewTabs.push({
				activationId: this.viewActivateCounter,
				active: true,
				title: viewTitle,
				url: location.hash
			});
		}
	}

	private extractViewTitle(): string {
		let title: string;
		this.activeRoute.snapshot.children.forEach(snapshot => {
			title = snapshot.data['title'];
			if (title && title.endsWith(': ') && snapshot.params['id']) {
				title += snapshot.params['id'];
			}
		});
		return title;
	}

	private removeLastExtraTab() {
		if (this.openViewTabs.length > MAX_OPEN_VIEWS) {
			let tabToRemove: ViewTabData;
			let tabToRemoveIndex = -1;
			for (let i = 0; i < this.openViewTabs.length; i++) {
				let tab = this.openViewTabs[i];
				if (!tabToRemove || tab.activationId < tabToRemove.activationId) {
					tabToRemove = tab;
					tabToRemoveIndex = i;
				}
			}
			if (tabToRemove) {
				this.openViewTabs.slice(tabToRemoveIndex, 1);
			}
		}
	}
}
