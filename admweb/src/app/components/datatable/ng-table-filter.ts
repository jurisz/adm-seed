import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FilterDataType} from "./ng-table";

const COMMON_OPERATIONS = ['=', '<>', 'is defined', 'not defined'];

/*
 const TYPE_BASED_OPERATIONS = new Map<FilterDataType, String[]>()
 .set(FilterDataType.STRING, ['empty', 'starts with', 'contains', 'not contains'])
 .set(FilterDataType.NUMBER, ['>', '>=', '<', '<=', 'range'])
 .set(FilterDataType.DECIMAL, ['>', '>=', '<', '<=', 'range'])
 .set(FilterDataType.DATE, ['>', '>=', '<', '<=', 'period'])
 .set(FilterDataType.DATE_TIME, ['>', '>=', '<', '<=', 'period']);
 */

const OPERATION_PARAMS_COUNT = {
	0: ['is defined', 'not defined', 'empty'],
	1: ['=', '<>', '>', '>=', '<', '<=', 'starts with', 'contains', 'not contains', '>'],
	2: ['period', 'range including']
};

@Component({
	selector: 'filter',
	template: `
    <h4>{{name}}</h4>
    <button (click)="vote(true)"  [disabled]="voted">Agree</button>
    <button (click)="vote(false)" [disabled]="voted">Disagree</button>
  `
})
export class NgTableFilter {
	title: string;
	property: string;
	type: FilterDataType;
	value1: string;
	value2: string;

	//todo: think about date time picker, lists etc

	@Input() name: string;
	@Output() onVoted = new EventEmitter<boolean>();
	voted = false;

	vote(agreed: boolean) {
		this.onVoted.emit(agreed);
		this.voted = true;
	}
}

