package org.juz.seed.web.api;

import org.juz.common.command.CommandService;
import org.juz.seed.api.enity.EntityPageQuery;
import org.juz.seed.api.enity.EntityQuery;
import org.juz.seed.api.enity.PageResult;
import org.juz.seed.api.excel.ExcelExportStatusResponse;
import org.juz.seed.api.security.UserBean;
import org.juz.seed.base.entity.EntityPageQueryRepository;
import org.juz.seed.base.security.User;
import org.juz.seed.base.security.UserCrudCommand;
import org.juz.seed.base.security.UserRepository;
import org.juz.seed.base.xls.ExcelExportService;
import org.juz.seed.web.aop.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import static org.juz.seed.base.security.Permissions.ADMIN;

@RestController
@RequestMapping("/api/admin/security/user")
public class UserController {

	private EntityPageQueryRepository pageQueryRepository;

	private UserRepository userRepository;

	private CommandService commandService;

	private ExcelExportService excelExportService;

	@Autowired
	public UserController(EntityPageQueryRepository pageQueryRepository,
						  UserRepository userRepository,
						  CommandService commandService,
						  ExcelExportService excelExportService) {
		this.pageQueryRepository = pageQueryRepository;
		this.userRepository = userRepository;
		this.commandService = commandService;
		this.excelExportService = excelExportService;
	}

	@PreAuthorize("hasAnyRole('" + ADMIN + "')")
	@RequestMapping(value = "list", method = RequestMethod.POST)
	@Transactional
	public PageResult<UserBean> list(@RequestBody EntityPageQuery query) {
		return pageQueryRepository.list(User.class, query, User::toBean);
	}

	@PreAuthorize("hasAnyRole('" + ADMIN + "')")
	@RequestMapping(value = "/start-excel-export", method = RequestMethod.POST)
	@Transactional
	public ExcelExportStatusResponse startExcelExport(@RequestBody EntityQuery query) {
		return excelExportService.initiateExport(User.class, query, User::toBean);
	}

	@PreAuthorize("hasAnyRole('" + ADMIN + "')")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@Transactional
	public UserBean get(@PathVariable("id") Long id) {
		return userRepository.findOne(id)
				.map(User::toBean)
				.orElseThrow(() -> new ResourceNotFoundException("User with id: " + id + " doesn't exists!"));
	}

	@PreAuthorize("hasAnyRole('" + ADMIN + "')")
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public Long save(@RequestBody UserCrudCommand command) {
		return commandService.execute(command);
	}
}
