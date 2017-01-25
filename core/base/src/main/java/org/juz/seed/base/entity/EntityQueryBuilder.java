package org.juz.seed.base.entity;

import com.google.common.base.Joiner;
import org.juz.seed.api.enity.Filter;

import javax.persistence.metamodel.EntityType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class EntityQueryBuilder {

	private static final String NORMAL_QUERY = "SELECT e ";
	private static final String COUNT_QUERY = "SELECT count(e) ";

	private String query;
	private Map<String, Object> params = new HashMap<>();

	EntityQueryBuilder(Class<?> clazz, EntityType<?> jpaEntityType, List<Filter> filters) {
		StringBuilder jpqBuilder = new StringBuilder();
		jpqBuilder.append("FROM ").append(clazz.getSimpleName()).append(" e");
		if (!filters.isEmpty()) {
			jpqBuilder.append(" WHERE ");
			FilterCriteriaBuilder criteriaBuilder = new FilterCriteriaBuilder();
			criteriaBuilder.buildRestrictions(filters, jpaEntityType);
			String restrictions = Joiner.on(" AND ").skipNulls().join(criteriaBuilder.getClauses());
			jpqBuilder.append(restrictions);
			params = criteriaBuilder.getParams();
		}
		query = jpqBuilder.toString();
	}

	String getQuery() {
		return NORMAL_QUERY + query;
	}

	String getCountQuery() {
		return COUNT_QUERY + query;
	}

	Map<String, Object> getParameters() {
		return params;
	}
}
