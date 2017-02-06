import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PaginationModule} from "ng2-bootstrap/pagination";
import {DataTableComponent} from "./datatable/data-table";
import {DataTableFiltersPanel, DataTableFilter} from "./datatable/data-table-filter";

@NgModule({
	imports: [CommonModule, PaginationModule.forRoot(), FormsModule],
	declarations: [DataTableComponent, DataTableFiltersPanel, DataTableFilter],
	exports: [DataTableComponent, DataTableFiltersPanel, DataTableFilter, CommonModule, FormsModule]
})
export class SharedModule {
}