package org.juz.seed.web.api;

import org.juz.seed.api.enity.EntityPageQuery;
import org.juz.seed.api.enity.PageResult;
import org.juz.seed.api.security.RoleBean;
import org.juz.seed.base.entity.EntityPageQueryRepository;
import org.juz.seed.base.security.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import static org.juz.seed.base.security.Permissions.ADMIN;
import static org.juz.seed.base.security.Permissions.BASE_READ;

@RestController
@RequestMapping("/api/admin/security/user-role")
public class UserRoleController {

	@Autowired
	EntityPageQueryRepository pageQueryRepository;

	@PreAuthorize("hasAnyRole('" + BASE_READ + "," + ADMIN + "')")
	@RequestMapping(value = "list", method = RequestMethod.POST)
	@Transactional
	public PageResult<RoleBean> list(@RequestBody EntityPageQuery query) {
		return pageQueryRepository.list(Role.class, query, Role::toBean);
	}

}
