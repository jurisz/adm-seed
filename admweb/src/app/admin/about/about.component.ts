import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'about',
    styles: [`
  `],
    template: `
    <h1>About</h1>
    <div>
      For hot module reloading run
      <pre>npm run start:hmr</pre>
    </div>
    <div>
      <h3>
        patrick@AngularClass.com
      </h3>
    </div>
  `
})
export class About implements OnInit {

    constructor() {
    }

    ngOnInit() {

    }
}
