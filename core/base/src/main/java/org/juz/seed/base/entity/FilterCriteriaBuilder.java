package org.juz.seed.base.entity;

import com.google.common.collect.Lists;
import org.juz.common.util.DateTimeUtils;
import org.juz.seed.api.enity.Filter;
import org.juz.seed.api.enity.FilterOperation;
import org.juz.seed.api.enity.FilterValueType;

import javax.persistence.metamodel.EntityType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Preconditions.checkState;

class FilterCriteriaBuilder {

	private List<String> clauses = new ArrayList<>();
	private Map<String, Object> params = new HashMap<>();

	void buildRestrictions(List<Filter> filters, EntityType<?> jpaEntityType) {
		filters.forEach(filter -> {
			String propertyName = checkNotNull(filter.getPropertyName(), "property name is required");
			String operation = checkNotNull(filter.getFilterOperation(), "operation required");

			String filterValue1 = filter.getFilterValue1();
			checkFilterValue1Exists(operation, filterValue1);
			String filterValue2 = filter.getFilterValue2();
			FilterValueType parameterValueType = filter.getParameterValueType();

			String sqlOperation = convertToSqlOperation(operation);
			String propertyParam = propertyName.replace(".", "_");

			if (operation.equals(FilterOperation.IS_NULL) || operation.equals(FilterOperation.IS_NOT_NULL)) {
				clauses.add(propertyName + sqlOperation);
			} else if (operation.equals(FilterOperation.BETWEEN)) {
				checkNotNull(filterValue2, "Operation 'between' require 2 parameters");
				String p1 = propertyParam + "_1";
				String p2 = propertyParam + "_2";
				clauses.add("( " + propertyName + sqlOperation + ":" + p1 + " and :" + p2 + " )");
				Object converterValue1 = convertFilterValue(filterValue1, filter.getParameterValueType(), propertyName, jpaEntityType);
				params.put(p1, converterValue1);
				Object converterValue2 = convertFilterValue(filterValue2, filter.getParameterValueType(), propertyName, jpaEntityType);
				params.put(p2, converterValue2);
			} else if (operation.equals(FilterOperation.STARTS_WITH)) {
				clauses.add(propertyName + sqlOperation + ":" + propertyParam);
				params.put(propertyParam, filterValue1 + "%");
			} else if (operation.equals(FilterOperation.CONTAIN)) {
				if (FilterValueType.STRING.equals(parameterValueType)) {
					clauses.add("lower(" + propertyName + ")" + sqlOperation + "lower(:" + propertyParam + ")");
				} else {
					clauses.add(propertyName + sqlOperation + ":" + propertyParam);
				}
				params.put(propertyParam, "%" + filterValue1 + "%");
			} else if (operation.equals(FilterOperation.NOT_CONTAIN)) {
				clauses.add(propertyName + sqlOperation + ":" + propertyParam);
				params.put(propertyParam, "%" + filterValue1 + "%");
			} else if (operation.equals(FilterOperation.IN)) {
				List<String> filterInListValues = checkNotNull(filter.getInListValues(), "Operation 'IN' require list values");
				List<Object> filterInListValuesConverted = Lists.newArrayList();
				filterInListValuesConverted.addAll(
						filterInListValues.stream().map(
								filterInListValue -> convertFilterValue(filterInListValue, filter.getParameterValueType(),
										propertyName, jpaEntityType)).collect(Collectors.toList()));
				clauses.add(propertyName + sqlOperation + ":" + propertyParam);
				params.put(propertyParam, filterInListValuesConverted);
			} else if (operation.equals(FilterOperation.EQ) && parameterValueType == FilterValueType.LOCAL_DATE_TIME) {
				String p1 = propertyParam + "_1";
				String p2 = propertyParam + "_2";
				clauses.add("( " + propertyName + " between " + ":" + p1 + " and :" + p2 + " )");
				LocalDateTime localDateStart = DateTimeUtils.date(filterValue1).atStartOfDay();
				params.put(p1, localDateStart);
				params.put(p2, localDateStart.plusDays(1));
			} else {
				clauses.add(propertyName + sqlOperation + ":" + propertyParam);
				Object converterValue1 = convertFilterValue(filterValue1, parameterValueType, propertyName, jpaEntityType);
				params.put(propertyParam, converterValue1);
			}
		});
	}

	private void checkFilterValue1Exists(String operation, String filterValue) {
		checkState(filterValue != null
						|| operation.equals(FilterOperation.IS_NULL)
						|| operation.equals(FilterOperation.IS_NOT_NULL)
						|| operation.equals(FilterOperation.IN),
				"Operation '%s' require filter parameter", operation
		);
	}

	List<String> getClauses() {
		return clauses;
	}

	Map<String, Object> getParams() {
		return params;
	}

	private String convertToSqlOperation(String operation) {
		switch (operation) {
			case FilterOperation.EQ:
			case FilterOperation.LT:
			case FilterOperation.LE:
			case FilterOperation.GT:
			case FilterOperation.GE:
			case FilterOperation.NE:
			case FilterOperation.IS_NULL:
			case FilterOperation.IS_NOT_NULL:
			case FilterOperation.BETWEEN:
			case FilterOperation.IN:
				return " " + operation + " ";
			case FilterOperation.STARTS_WITH:
			case FilterOperation.CONTAIN:
				return " like ";
			case FilterOperation.NOT_CONTAIN:
				return " not like ";
			default:
				throw new IllegalArgumentException("Undefined operation: " + operation);
		}
	}

	@SuppressWarnings("unchecked")
	private Object convertFilterValue(String filterValue, FilterValueType valueType, String propertyType, EntityType<?> jpaEntityType) {
		switch (valueType) {
			case INTEGER:
				return Integer.parseInt(filterValue);
			case LONG:
				return Long.parseLong(filterValue);
			case STRING:
				return filterValue;
			case BIG_DECIMAL:
				return new BigDecimal(filterValue);
			case BOOLEAN:
				return Boolean.parseBoolean(filterValue);
			case ENUM:
				Class<? extends Enum> javaType = (Class<? extends Enum>) jpaEntityType.getAttribute(propertyType).getJavaType();
				return Enum.valueOf(javaType, filterValue);
			case LOCAL_DATE:
				return DateTimeUtils.date(filterValue);
			case LOCAL_DATE_TIME:
				return DateTimeUtils.date(filterValue).atStartOfDay();
			default:
				throw new IllegalArgumentException("Undefined conversion type: " + valueType);
		}
	}
}
