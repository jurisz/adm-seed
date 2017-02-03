import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PaginationModule} from "ng2-bootstrap/pagination";
import {NgTableComponent} from "./datatable/ng-table";
import {NgTableFiltersPanel, NgTableFilter} from "./datatable/ng-table-filter";

@NgModule({
	imports: [CommonModule, PaginationModule.forRoot(), FormsModule],
	declarations: [NgTableComponent, NgTableFiltersPanel, NgTableFilter],
	exports: [NgTableComponent, NgTableFiltersPanel, NgTableFilter, CommonModule, FormsModule]
})
export class SharedModule {
}