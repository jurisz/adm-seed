import {Routes} from "@angular/router";
import {Home} from "./home";
import {About} from "./about";
import {NoContent} from "./no-content";
import {Login} from "./component/login";

// import { DataResolver } from './app.resolver';

// AngularClass
// import { provideWebpack } from '@angularclass/webpack-toolkit';
// import { providePrefetchIdleCallbacks } from '@angularclass/request-idle-callback';

export const ROUTES: Routes = [
    {path: '', component: Home},
    {path: 'home', component: Home},
    {path: 'about', component: About},
    {
        path: 'detail', loadChildren: () => require('es6-promise-loader!./+detail')('default')
    },
    {path: 'login', component: Login},
    {path: '**', component: NoContent},
];
