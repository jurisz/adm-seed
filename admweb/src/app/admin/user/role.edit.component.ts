import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'role',
	templateUrl: './role.edit.html'
})
export class Role implements OnInit, OnDestroy {

	roleId: number;
	private routeSubscription: any;

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.routeSubscription = this.route.params.subscribe(params => {
			this.roleId = +params['id'];
			if (this.roleId) {
				this.loadRole(this.roleId);
			}
		});
	}

	ngOnDestroy(): void {
		this.routeSubscription.unsubscribe();
	}

	private loadRole(roleId: number) {
		
		
	}
}
