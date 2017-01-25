package org.juz.seed.api.enity;

import java.util.List;

public class Filter {

	private String propertyName;
	private String filterOperation;
	private FilterValueType parameterValueType;
	private String filterValue1;
	private String filterValue2;
	private List<String> inListValues;

	public Filter() {
	}

	public Filter(String propertyName, String filterOperation, FilterValueType parameterValueType, String filterValue1) {
		this(propertyName, filterOperation, parameterValueType, filterValue1, null);
	}

	public Filter(String propertyName, String filterOperation, FilterValueType parameterValueType, String filterValue1, String filterValue2) {
		this.propertyName = propertyName;
		this.filterOperation = filterOperation;
		this.parameterValueType = parameterValueType;
		this.filterValue1 = filterValue1;
		this.filterValue2 = filterValue2;
	}

	public String getPropertyName() {
		return propertyName;
	}

	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}

	public String getFilterOperation() {
		return filterOperation;
	}

	public void setFilterOperation(String filterOperation) {
		this.filterOperation = filterOperation;
	}

	public FilterValueType getParameterValueType() {
		return parameterValueType;
	}

	public void setParameterValueType(FilterValueType parameterValueType) {
		this.parameterValueType = parameterValueType;
	}

	public String getFilterValue1() {
		return filterValue1;
	}

	public void setFilterValue1(String filterValue1) {
		this.filterValue1 = filterValue1;
	}

	public String getFilterValue2() {
		return filterValue2;
	}

	public void setFilterValue2(String filterValue2) {
		this.filterValue2 = filterValue2;
	}

	public List<String> getInListValues() {
		return inListValues;
	}

	public void setInListValues(List<String> inListValues) {
		this.inListValues = inListValues;
	}
}
