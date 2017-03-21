package org.juz.seed.web.api;

import org.apache.commons.io.FileUtils;
import org.juz.seed.api.excel.ExcelExportStatusResponse;
import org.juz.seed.base.xls.ExcelExportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

import static org.juz.seed.base.security.Permissions.ADMIN;

@RestController
@RequestMapping("/api/admin/excel-export")
public class ExcelExportController {

	private static final Logger log = LoggerFactory.getLogger(ExcelExportController.class);

	@Autowired
	private ExcelExportService excelExportService;

	@PreAuthorize("hasAnyRole('" + ADMIN + "')")
	@RequestMapping(value = "/check/{id}", method = RequestMethod.GET)
	public ExcelExportStatusResponse checkExport(@PathVariable String id) {
		return excelExportService.getExportStatus(id);
	}

	@PreAuthorize("hasAnyRole('" + ADMIN + "')")
	@RequestMapping(value = "/cancel/{id}", method = RequestMethod.POST)
	public void cancelExportProcess(@PathVariable String id) {
		excelExportService.cancelExportProcess(id);
	}
	
	@PreAuthorize("hasAnyRole('" + ADMIN + "')")
	@RequestMapping(value = "/download/{id}", method = RequestMethod.GET)
	public void getExcelExportFileById(@PathVariable String id, HttpServletResponse response) {
		File file = excelExportService.getExcelExportFile(id);
		try {
			response.reset();
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			response.setDateHeader("Expires", 0);
			response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
			response.setHeader("Pragma", "no-cache");
			response.addHeader("Content-Length", Long.toString(file.length()));
			response.setHeader("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"");
			FileUtils.copyFile(file, response.getOutputStream());
		} catch (IOException e) {
			log.error("Excel export failed", e);
		} finally {
			excelExportService.cleanUpExportedFile(id);
		}
	}
}
