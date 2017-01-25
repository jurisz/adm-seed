package org.juz.seed.base.entity

import org.juz.seed.api.enity.Filter
import org.juz.seed.api.enity.FilterOperation
import org.juz.seed.api.enity.FilterValueType
import org.juz.seed.base.security.User
import spock.lang.Specification

import javax.persistence.metamodel.EntityType

class EntityQueryBuilderSpec extends Specification {

	EntityQueryBuilder builder

	private EntityType<?> jpaEntityType = Mock(EntityType)

	def 'query without filters'() {
		when:
		builder = new EntityQueryBuilder(User.class, jpaEntityType, [])

		then:
		builder.query == 'SELECT e FROM User e'
		builder.parameters.size() == 0
	}

	def 'simple filter by id'() {
		when:
		def filters = [new Filter('id', FilterOperation.EQ, FilterValueType.LONG, '100')]
		builder = new EntityQueryBuilder(User.class, jpaEntityType, filters)

		then:
		builder.query == 'SELECT e FROM User e WHERE id = :id'
		builder.parameters['id'] == 100L
	}

	def 'query using 2 filters'() {
		when:
		def filters = [new Filter('id', FilterOperation.EQ, FilterValueType.LONG, '100'),
					   new Filter('name', FilterOperation.STARTS_WITH, FilterValueType.STRING, 'abc')]

		builder = new EntityQueryBuilder(User.class, jpaEntityType, filters)

		then:
		builder.query == 'SELECT e FROM User e WHERE id = :id AND name like :name'
		builder.parameters['id'] == 100L
		builder.parameters['name'] == 'abc%'
	}

	def 'filter of complex property'() {
		when:
		def filters = [new Filter('client.id', FilterOperation.EQ, FilterValueType.LONG, '100')]
		builder = new EntityQueryBuilder(User.class, jpaEntityType, filters)

		then:
		builder.query == 'SELECT e FROM User e WHERE client.id = :client_id'
		builder.parameters['client_id'] == 100L
	}

	def 'query for between'() {
		when:
		def filters = [new Filter('id', FilterOperation.BETWEEN, FilterValueType.LONG, '100', '200')]
		builder = new EntityQueryBuilder(User.class, jpaEntityType, filters)

		then:
		builder.query == 'SELECT e FROM User e WHERE ( id between :id_1 and :id_2 )'
		builder.parameters['id_1'] == 100L
		builder.parameters['id_2'] == 200L
	}

	def 'filter for not null'() {
		when:
		def filters = [new Filter('id', FilterOperation.IS_NOT_NULL, FilterValueType.LONG, null)]
		builder = new EntityQueryBuilder(User.class, jpaEntityType, filters)

		then:
		builder.query == 'SELECT e FROM User e WHERE id is not null '
	}

	def 'filter for null'() {
		when:
		def filters = [new Filter('id', FilterOperation.IS_NULL, FilterValueType.LONG, null)]
		builder = new EntityQueryBuilder(User.class, jpaEntityType, filters)

		then:
		builder.query == 'SELECT e FROM User e WHERE id is null '
	}

	def 'filter for in'() {
		when:
		def filter = new Filter(propertyName: 'id',
				filterOperation: FilterOperation.IN,
				parameterValueType: FilterValueType.LONG,
				inListValues: ['1', '2']
		)
		builder = new EntityQueryBuilder(User.class, jpaEntityType, [filter])

		then:
		builder.query == 'SELECT e FROM User e WHERE id in :id'
		builder.parameters['id'] == [1L, 2L]
	}

	def 'term value as embedded parameter'() {
		when:
		def filters = [new Filter('term.value', FilterOperation.EQ, FilterValueType.INTEGER, '1')]
		builder = new EntityQueryBuilder(User.class, jpaEntityType, filters)

		then:
		builder.query == 'SELECT e FROM User e WHERE term.value = :term_value'
		builder.parameters['term_value'] == 1
	}

	def 'normal operations require to submit first parameter'() {
		when:
		def filters = [new Filter('id', FilterOperation.EQ, FilterValueType.LONG, null)]
		builder = new EntityQueryBuilder(User.class, jpaEntityType, filters)

		then:
		def e = thrown(IllegalStateException)
		e.message == "Operation '=' require filter parameter"
	}
}