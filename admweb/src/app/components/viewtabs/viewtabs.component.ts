import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Event, NavigationEnd, Router} from "@angular/router";
import {ViewTabsService} from "../../service/viewtabs.service";

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
	<li class="nav-item" *ngIf="openViewTabs.length>0">
		<a class="nav-link no-border"><button class="close close-all" type="button" title="Close all tabs" (click)="closeAllViews()">×</button></a>
	</li>
  <li class="nav-item" *ngFor="let view of openViewTabs">
  	<a class="nav-link" [ngClass]="{'active': view.active}" [href]="view.url">
  		<button class="close closeTab" type="button" (click)="closeView(view)">×</button>
  		{{view.title}}
  	</a> 
  </li>	
</ul>
    `,
	styles: [`
.openview-nav {
	margin-top: 45px;
}
.closeTab {
 margin: 0 0 0 10px;
 font-size: 1rem;
}
.closeTab:focus, .close-all:focus, .close-all:hover{
	outline: none;
}
.nav-link {
 padding: .5em .5em .5em 1em;
}
.no-border:hover {
	border-color: transparent;
}   
`]
})
export class OpenViewTabsComponent implements OnInit {

	private viewActivateCounter = 0;
	private openViewTabs: ViewTabData[] = [];

	constructor(private router: Router,
				private activeRoute: ActivatedRoute,
				private viewTabsService: ViewTabsService) {
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

		this.viewTabsService.closeViewSender$.subscribe(
			title => this.closeViewByTitle(title)
		)
	}

	private processSuccessEvent(event: Event) {
		if (event instanceof NavigationEnd) {
			let viewTitle = this.extractViewTitle();
			if (viewTitle) {
				this.addOrActivateTitle(viewTitle);
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
				this.openViewTabs.splice(tabToRemoveIndex, 1);
			}
		}
	}

	closeView(viewToClose: ViewTabData): boolean {
		let tabToRemoveIndex = this.openViewTabs.indexOf(viewToClose);
		if (tabToRemoveIndex > -1) {
			this.openViewTabs.splice(tabToRemoveIndex, 1);
			this.activateLastTab();
		}
		return false;
	}

	private closeViewByTitle(title: String) {
		this.closeView(this.openViewTabs.find(view => view.title == title));
	}

	private activateLastTab() {
		if (this.openViewTabs.length > 0) {
			let maxActivationId = Math.max.apply(null, this.openViewTabs.map(view => view.activationId));
			let lastActiveTab = this.openViewTabs.find(view => view.activationId === maxActivationId);
			this.router.navigateByUrl(lastActiveTab.url.substr(1));
		} else {
			this.router.navigateByUrl('/admin');
		}
	}

	closeAllViews(): void {
		this.openViewTabs = [];
		this.router.navigateByUrl('/admin');
	}


}
