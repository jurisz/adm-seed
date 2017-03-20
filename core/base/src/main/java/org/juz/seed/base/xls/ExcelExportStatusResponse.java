package org.juz.seed.base.xls;

public class ExcelExportStatusResponse {

	private String id;

	private long totalRecords;

	private long processedRecords;

	private ExcelExportStatus status = ExcelExportStatus.PROCESSING;

	private String fileName;

	public ExcelExportStatusResponse() {
	}

	public ExcelExportStatusResponse(String id, String fileName) {
		this.id = id;
		this.fileName = fileName;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public long getTotalRecords() {
		return totalRecords;
	}

	public void setTotalRecords(long totalRecords) {
		this.totalRecords = totalRecords;
	}

	public long getProcessedRecords() {
		return processedRecords;
	}

	public void setProcessedRecords(long processedRecords) {
		this.processedRecords = processedRecords;
	}

	public ExcelExportStatus getStatus() {
		return status;
	}

	public void setStatus(ExcelExportStatus status) {
		this.status = status;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
}
