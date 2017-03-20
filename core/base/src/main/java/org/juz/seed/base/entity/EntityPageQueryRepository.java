package org.juz.seed.base.entity;


import org.juz.common.persistence.model.BaseEntity;
import org.juz.seed.api.enity.EntityPageQuery;
import org.juz.seed.api.enity.EntityQuery;
import org.juz.seed.api.enity.PageResult;

import java.util.function.Function;

public interface EntityPageQueryRepository {
	<E extends BaseEntity, T> PageResult<T> list(Class<E> clazz,
												 EntityPageQuery query,
												 Function<E, T> transformer);

	<E extends BaseEntity> ScrollableEntityQueryResult scroll(Class<E> clazz,
															  EntityQuery query);

}
