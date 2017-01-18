import {Component, OnInit} from "@angular/core";
import {Router, Event, NavigationEnd} from "@angular/router";

const MAX_OPEN_VIEWS = 12;

@Component({
	selector: 'openviews',
	template: `
<ul class="nav nav-tabs openview-nav">
  <li class="nav-item">
    <a class="nav-link active" href="#">Active</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link disabled" href="#">Disabled</a>
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

	constructor(private router: Router) {
	}

	ngOnInit(): void {
		this.router.events.subscribe(
			event => {
				this.processSuccessEvent(event);
			},
			error => {
				console.log("routing error: " + error);
			}
		)
	}

	private processSuccessEvent(event: Event) {
		console.log("routing event: " + event);
		if (event instanceof NavigationEnd) {
			console.log("nav success with routed to: " + event.url);
		}
	}
}
