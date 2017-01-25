package org.juz.seed.base.entity;


import org.juz.common.persistence.model.BaseEntity;
import org.juz.seed.api.enity.EntityPageQuery;
import org.juz.seed.api.enity.PageResult;
import org.juz.seed.api.enity.SortOption;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.metamodel.EntityType;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.google.common.base.Preconditions.checkArgument;

@Repository
class EntityPageQueryRepositoryBean implements EntityPageQueryRepository {

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public <E extends BaseEntity, T> PageResult<T> list(Class<E> clazz, EntityPageQuery query, Function<E, T> transformer) {

		PageResult<T> pageResult = new PageResult<>();

		EntityType<E> jpaEntityType = entityManager.getMetamodel().entity(clazz);
		EntityQueryBuilder queryBuilder = new EntityQueryBuilder(clazz, jpaEntityType, query.getFilters());
		pageResult.setPage(query.getPage());
		pageResult.setTotalRecords(queryForTotalRecords(queryBuilder));

		List<E> foundEntities = queryForEntities(queryBuilder, query);
		pageResult.setResults(foundEntities.stream()
				.map(transformer)
				.collect(Collectors.toList()));

		return pageResult;
	}

	@SuppressWarnings("unchecked")
	private <E extends BaseEntity> List<E> queryForEntities(EntityQueryBuilder queryBuilder, EntityPageQuery pageQuery) {
		String jpaQuery = queryBuilder.getQuery() + addSorting(pageQuery.getSortOption());

		checkArgument(pageQuery.getPageSize() < 201, "Page size too large");
		Query query = entityManager.createQuery(jpaQuery);
		setQueryParameters(query, queryBuilder);
		query.setFirstResult((pageQuery.getPage() - 1) * pageQuery.getPageSize());
		query.setMaxResults(pageQuery.getPageSize());

		return (List<E>) query.getResultList();
	}

	private String addSorting(SortOption sortOption) {
		if (sortOption == null || sortOption.getPropertyName() == null || sortOption.getDirection() == null) {
			return " order by id DESC";
		} else {
			return " order by " + sortOption.getPropertyName() + " " + sortOption.getDirection();
		}
	}

	private long queryForTotalRecords(EntityQueryBuilder queryBuilder) {
		Query query = entityManager.createQuery(queryBuilder.getCountQuery());
		setQueryParameters(query, queryBuilder);
		return (long) query.getSingleResult();
	}

	private void setQueryParameters(Query query, EntityQueryBuilder queryBuilder) {
		Map<String, Object> parameters = queryBuilder.getParameters();
		if (!parameters.isEmpty()) {
			parameters.forEach(query::setParameter);
		}
	}
}
