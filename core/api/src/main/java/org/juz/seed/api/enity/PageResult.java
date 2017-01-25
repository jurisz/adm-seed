package org.juz.seed.api.enity;

import java.util.ArrayList;
import java.util.List;

public class PageResult<T> {

	private long totalRecords;
	private int page;
	private List<T> results = new ArrayList<>();

	public long getTotalRecords() {
		return totalRecords;
	}

	public void setTotalRecords(long totalRecords) {
		this.totalRecords = totalRecords;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public List<T> getResults() {
		return results;
	}

	public void setResults(List<T> results) {
		this.results = results;
	}
}
