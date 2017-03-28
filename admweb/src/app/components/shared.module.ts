import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {PaginationModule} from "ng2-bootstrap/pagination";
import {ConfirmDialog, DialogContainer, ErrorDialog} from "./dialogs/";
import {DataTableComponent} from "./datatable/data-table";
import {DataTableFilter, DataTableFiltersPanel} from "./datatable/data-table-filter";

@NgModule({
	imports: [CommonModule, RouterModule, PaginationModule.forRoot(), FormsModule],
	declarations: [DataTableComponent, DataTableFiltersPanel, DataTableFilter,
		DialogContainer, ErrorDialog, ConfirmDialog],
	exports: [DataTableComponent, DataTableFiltersPanel, DataTableFilter, CommonModule, FormsModule, RouterModule,
		DialogContainer, ErrorDialog, ConfirmDialog]
})
export class SharedModule {
}
