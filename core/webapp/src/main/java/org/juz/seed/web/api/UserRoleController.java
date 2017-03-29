package org.juz.seed.web.api;

import org.juz.common.command.CommandService;
import org.juz.seed.api.enity.EntityPageQuery;
import org.juz.seed.api.enity.PageResult;
import org.juz.seed.api.security.RoleBean;
import org.juz.seed.base.entity.EntityPageQueryRepository;
import org.juz.seed.base.security.Role;
import org.juz.seed.base.security.RoleCrudCommand;
import org.juz.seed.base.security.RoleRepository;
import org.juz.seed.web.aop.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import static org.juz.seed.base.security.Permissions.ADMIN;
import static org.juz.seed.base.security.Permissions.BASE_READ;

@RestController
@RequestMapping("/api/admin/security/user-role")
public class UserRoleController {

	private EntityPageQueryRepository pageQueryRepository;

	private RoleRepository roleRepository;

	private CommandService commandService;

	@Autowired
	public UserRoleController(EntityPageQueryRepository pageQueryRepository, RoleRepository roleRepository, CommandService commandService) {
		this.pageQueryRepository = pageQueryRepository;
		this.roleRepository = roleRepository;
		this.commandService = commandService;
	}

	@PreAuthorize("hasAnyRole('" + BASE_READ + "," + ADMIN + "')")
	@RequestMapping(value = "list", method = RequestMethod.POST)
	@Transactional
	public PageResult<RoleBean> list(@RequestBody EntityPageQuery query) {
		return pageQueryRepository.list(Role.class, query, Role::toBean);
	}

	@PreAuthorize("hasAnyRole('" + ADMIN + "')")
	@RequestMapping(value = "/role/{id}", method = RequestMethod.GET)
	@Transactional
	public RoleBean get(@PathVariable("id") Long id) {
		return roleRepository.findOne(id)
				.map(Role::toBean)
				.orElseThrow(() -> new ResourceNotFoundException("Role with id: " + id + " doesn't exists!"));
	}

	@PreAuthorize("hasAnyRole('" + ADMIN + "')")
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public Long save(@RequestBody RoleCrudCommand command) {
		return commandService.execute(command);
	}
}
