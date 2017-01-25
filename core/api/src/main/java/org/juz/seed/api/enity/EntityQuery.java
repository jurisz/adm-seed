package org.juz.seed.api.enity;

import java.util.ArrayList;
import java.util.List;

public class EntityQuery {

	private SortOption sortOption;

	private List<Filter> filters = new ArrayList<>();

	public SortOption getSortOption() {
		return sortOption;
	}

	public void setSortOption(SortOption sortOption) {
		this.sortOption = sortOption;
	}

	public List<Filter> getFilters() {
		return filters;
	}

	public void setFilters(List<Filter> filters) {
		this.filters = filters;
	}
}
