package org.juz.seed.web.api;

import org.juz.seed.api.enity.EntityPageQuery;
import org.juz.seed.api.enity.PageResult;
import org.juz.seed.api.security.UserBean;
import org.juz.seed.base.entity.EntityPageQueryRepository;
import org.juz.seed.base.security.User;
import org.juz.seed.base.security.UserRepository;
import org.juz.seed.web.aop.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import static org.juz.seed.base.security.Permissions.ADMIN;
import static org.juz.seed.base.security.Permissions.BASE_READ;

@RestController
@RequestMapping("/api/admin/security/user")
public class UserController {

	@Autowired
	EntityPageQueryRepository pageQueryRepository;

	@Autowired
	UserRepository userRepository;

	@PreAuthorize("hasAnyRole('" + BASE_READ + "," + ADMIN + "')")
	@RequestMapping(value = "list", method = RequestMethod.POST)
	@Transactional
	public PageResult<UserBean> list(@RequestBody EntityPageQuery query) {
		return pageQueryRepository.list(User.class, query, User::toBean);
	}

	@PreAuthorize("hasAnyRole('" + BASE_READ + "," + ADMIN + "')")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@Transactional
	public UserBean get(@PathVariable Long id) {
		return userRepository.findOne(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + id))
				.toBean();
	}
}
