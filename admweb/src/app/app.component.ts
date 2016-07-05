/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from "@angular/core";
import {AppState} from "./app.service";

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.style.css'
    ],
    template: `
<div id="admin">
	<nav class="navbar navbar-fixed-top navbar-light bg-faded">
    	<div class="container-fluid">
            <button class="navbar-toggler hidden-md-up" type="button" data-toggle="collapse" data-target="#navbar">
                &#9776;
            </button>
            <a class="navbar-brand" [routerLink]=" ['./'] "><i class="fa fa-home"></i> Backoffice</a>
            <div class="collapse navbar-toggleable-sm" id="navbar">
                <ul class="nav navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#" role="button">Dashboards</a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" [routerLink]=" ['./home'] ">Home</a>
                            <a class="dropdown-item" [routerLink]=" ['./tasks-monitor'] ">Tasks</a>
                            <a class="dropdown-item" [routerLink]=" ['./payments-import-export'] ">Payments import/export</a>
                        </div>
                    </li>
                </ul>
                <ul class="nav navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#" role="button">Registers</a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" [routerLink]=" ['./home'] ">Home</a>
                            <a class="dropdown-item" [routerLink]=" ['./detail'] ">Detail link example</a>
                            <a class="dropdown-item" [routerLink]=" ['./about'] ">About</a>
                        </div>
                    </li>
                </ul>
                <ul class="nav navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#" role="button">System</a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" [routerLink]=" ['./about'] ">About</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
	</nav>
</div>

<main>
  <router-outlet></router-outlet>
</main>

<pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>

<footer>
  <span>Footer WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a></span>
  <div>
    <a [href]="url">
      <img [src]="angularclassLogo" width="25%">
    </a>
  </div>
</footer>
`
})
export class App {
    angularclassLogo = 'assets/img/angularclass-avatar.png';
    name = 'Angular 2 Webpack Starter';
    url = 'https://twitter.com/AngularClass';

    constructor(public appState:AppState) {

    }

    ngOnInit() {
        console.log('Initial App State', this.appState.state);
    }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
