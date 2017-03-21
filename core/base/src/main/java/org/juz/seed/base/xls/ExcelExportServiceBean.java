package org.juz.seed.base.xls;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.RemovalListener;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import org.hibernate.ScrollableResults;
import org.juz.common.infra.xls.ExcelDocument;
import org.juz.common.persistence.model.BaseEntity;
import org.juz.common.util.DateTimeUtils;
import org.juz.seed.api.enity.EntityQuery;
import org.juz.seed.api.excel.ExcelExportStatus;
import org.juz.seed.api.excel.ExcelExportStatusResponse;
import org.juz.seed.base.entity.EntityPageQueryRepository;
import org.juz.seed.base.entity.ScrollableEntityQueryResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.File;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;

import static java.lang.String.format;

@Component
public class ExcelExportServiceBean implements ExcelExportService {

	private static final Logger log = LoggerFactory.getLogger(ExcelExportServiceBean.class);

	private AtomicLong exportsCounter = new AtomicLong(0);

	private static final String TEMP_FILES_PATH = System.getProperty("java.io.tmpdir") + "/";

	private static final int BATCH_SIZE = 500;

	private static final int THREAD_POOL_SIZE = 5;

	private static final ThreadFactory THREAD_FACTORY = new ThreadFactoryBuilder()
			.setNameFormat("ExportExcel-%d")
			.setDaemon(true)
			.build();

	private static Cache<String, ExcelExportProcess> EXPORT_CACHE = CacheBuilder.newBuilder()
			.maximumSize(100)
			.expireAfterWrite(5, TimeUnit.HOURS)
			.removalListener((RemovalListener<String, ExcelExportProcess>) notification -> {
				log.info("Clean up cache key: {}", notification.getKey());
				ExcelExportProcess process = notification.getValue();
				if (process != null) {
					String filePath = TEMP_FILES_PATH + process.statusResponse.getFileName();
					File file = new File(filePath);
					file.delete();
				}
			})
			.build();

	private final ExecutorService EXECUTOR_SERVICE = Executors.newFixedThreadPool(THREAD_POOL_SIZE, THREAD_FACTORY);

	@Autowired
	private EntityPageQueryRepository pageQueryRepository;

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public <E extends BaseEntity, T> ExcelExportStatusResponse initiateExport(Class<E> clazz,
																			  EntityQuery query,
																			  Function<E, T> transformer) {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		String id = UUID.randomUUID().toString();
		String fileName = clazz.getSimpleName() + "-" + DateTimeUtils.today() + "-" + exportsCounter.incrementAndGet() + ".xlsx";
		ExcelExportStatusResponse exportStatusResponse = new ExcelExportStatusResponse(id, fileName);
		Future<?> process = EXECUTOR_SERVICE.submit(() -> generateExcelFile(clazz, query, transformer, exportStatusResponse));
		ExcelExportProcess exportProcess = new ExcelExportProcess(process, exportStatusResponse);
		EXPORT_CACHE.put(getKey(username, id), exportProcess);
		return exportStatusResponse;
	}

	@Override
	public ExcelExportStatusResponse getExportStatus(String id) {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		return loadExportStatus(username, id);
	}

	@Override
	public File getExcelExportFile(String id) {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		ExcelExportStatusResponse exportStatusResponse = loadExportStatus(username, id);
		if (exportStatusResponse.getStatus() == ExcelExportStatus.FINISHED) {
			return new File(TEMP_FILES_PATH + exportStatusResponse.getFileName());
		} else {
			throw new IllegalStateException(format("Excel export is not ready, file: %s", id));
		}
	}

	@Override
	public void cleanUpExportedFile(String id) {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		String cacheKey = getKey(username, id);
		EXPORT_CACHE.invalidate(cacheKey);
	}

	@Override
	public void cancelExportProcess(String id) {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		String cacheKey = getKey(username, id);
		EXPORT_CACHE.getIfPresent(cacheKey).process.cancel(true);
		cleanUpExportedFile(id);
	}

	private <E extends BaseEntity, T> void generateExcelFile(Class<E> clazz, EntityQuery query,
															 Function<E, T> transformer,
															 ExcelExportStatusResponse exportStatusResponse) {
		try {
			ExcelDocument document = new ExcelDocument();

			log.info("Starting Excel file generation: {}", exportStatusResponse.getFileName());

			ScrollableEntityQueryResult scrollResult = pageQueryRepository.scroll(clazz, query);
			exportStatusResponse.setTotalRecords(scrollResult.getTotalRecords());
			ScrollableResults scrollableList = scrollResult.getResults();

			int row = 0;
			String[] fieldNames = new String[]{};

			while (scrollableList.next()) {
				E entity = (E) scrollableList.get(0);
				T resultBean = transformer.apply(entity);
				if (row == 0) {
					fieldNames = Arrays.stream(resultBean.getClass().getDeclaredFields())
							.map(Field::getName)
							.toArray(String[]::new);
					document.writeHeaders(fieldNames);
				}
				document.writeRow(row + 1, resultBean, fieldNames);
				row++;
				exportStatusResponse.setProcessedRecords(row);

				if (row % BATCH_SIZE == 0) {
					entityManager.clear();
					log.info("Exported {] rows to {}", row, exportStatusResponse.getFileName());
				}
			}

			File file = new File(TEMP_FILES_PATH + exportStatusResponse.getFileName());
			document.exportToFile(file);
			exportStatusResponse.setStatus(ExcelExportStatus.FINISHED);
			log.info("Excel file generated and stored: {}", file.getAbsolutePath());
		} catch (Exception e) {
			exportStatusResponse.setStatus(ExcelExportStatus.ERROR);
			exportStatusResponse.setErrorMessage(e.getMessage());
			log.error("Excel export error: " + exportStatusResponse.getFileName(), e);
		}
	}

	private static ExcelExportStatusResponse loadExportStatus(String username, String id) {
		ExcelExportProcess process = EXPORT_CACHE.getIfPresent(getKey(username, id));
		if (process == null) {
			throw new IllegalArgumentException(format("Export with id: %s not found for user: %s!", id, username));
		} else {
			return process.statusResponse;
		}
	}

	private static String getKey(String username, String id) {
		return format("%s-%s", username, id);
	}

	private static class ExcelExportProcess {
		public ExcelExportProcess(Future process, ExcelExportStatusResponse statusResponse) {
			this.process = process;
			this.statusResponse = statusResponse;
		}

		Future process;
		ExcelExportStatusResponse statusResponse;
	}
}
