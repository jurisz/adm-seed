package org.juz.seed.base.security;

import org.juz.common.command.CommandHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
class RoleCrudHandler implements CommandHandler<RoleCrudCommand, Long> {

	private RoleRepository roleRepository;

	@Autowired
	public RoleCrudHandler(RoleRepository roleRepository) {
		this.roleRepository = roleRepository;
	}

	@Override
	public Long execute(RoleCrudCommand command) {
		switch (command.getOperation()) {
			case CREATE:
				return doCreate(command);
			case UPDATE:
				return doUpdate(command);
			case DELETE:
				return doDelete(command);
			default:
				throw new UnsupportedOperationException("Unknown operation: " + command.getOperation());
		}
	}

	private Long doCreate(RoleCrudCommand command) {
		Role role = new Role();
		role.setName(command.getName());
		role.setPermissions(command.getPermissions());
		roleRepository.save(role);
		return role.getId();
	}

	private Long doUpdate(RoleCrudCommand command) {
		Role role = loadRequiredRole(command);

		role.setName(command.getName());
		role.setPermissions(command.getPermissions());
		return role.getId();
	}

	private Role loadRequiredRole(RoleCrudCommand command) {
		return roleRepository.findOne(command.getId())
				.orElseThrow(() -> new IllegalArgumentException("Can't find role: " + command.getId()));
	}

	private Long doDelete(RoleCrudCommand command) {
		Role role = loadRequiredRole(command);
		roleRepository.delete(role);
		return role.getId();
	}
}
