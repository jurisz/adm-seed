package org.juz.seed.base.xls;


import org.juz.common.persistence.model.BaseEntity;
import org.juz.seed.api.enity.EntityQuery;
import org.juz.seed.api.excel.ExcelExportStatusResponse;

import java.io.File;
import java.util.function.Function;

public interface ExcelExportService {

	<E extends BaseEntity, T> ExcelExportStatusResponse initiateExport(Class<E> clazz,
																	   EntityQuery query,
																	   Function<E, T> transformer);

	ExcelExportStatusResponse getExportStatus(String id);

	File getExcelExportFile(String id);

	void cleanUpExportedFile(String id);

	void cancelExportProcess(String id);
}
