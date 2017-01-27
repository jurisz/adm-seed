import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PaginationModule} from "ng2-bootstrap/pagination";
import {NgTableComponent} from "./datatable/ng-table";

@NgModule({
	imports: [CommonModule, PaginationModule.forRoot(), FormsModule],
	declarations: [NgTableComponent],
	exports: [NgTableComponent, CommonModule, FormsModule]
})
export class SharedModule {
}