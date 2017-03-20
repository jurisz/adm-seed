package org.juz.seed.base.entity;

import org.hibernate.ScrollableResults;

public class ScrollableEntityQueryResult {

	private ScrollableResults results;

	long totalRecords;

	public ScrollableResults getResults() {
		return results;
	}

	public void setResults(ScrollableResults results) {
		this.results = results;
	}

	public long getTotalRecords() {
		return totalRecords;
	}

	public void setTotalRecords(long totalRecords) {
		this.totalRecords = totalRecords;
	}
}
