package org.juz.seed.base.security;

import org.juz.common.command.CommandHandler;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
class UserCrudHandler implements CommandHandler<UserCrudCommand, Long> {

	private UserRepository userRepository;

	private RoleRepository roleRepository;

	public UserCrudHandler(UserRepository userRepository, RoleRepository roleRepository) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

	@Override
	public Long execute(UserCrudCommand command) {
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

	private Long doCreate(UserCrudCommand command) {
		User user = new User();
		user.setUsername(command.getUsername());
		Role role = loadRequiredRole(command.getRoleName());
		user.setRole(role);
		userRepository.save(user);
		return user.getId();
	}

	private Long doUpdate(UserCrudCommand command) {
		User user = loadRequiredUser(command);
		user.setUsername(command.getUsername());
		Role role = loadRequiredRole(command.getRoleName());
		user.setRole(role);
		return user.getId();
	}

	private User loadRequiredUser(UserCrudCommand command) {
		return userRepository.findOne(command.getId())
				.orElseThrow(() -> new IllegalArgumentException("Can't find user: " + command.getId()));
	}

	private Role loadRequiredRole(String roleName) {
		return roleRepository.findByName(roleName)
				.orElseThrow(() -> new IllegalArgumentException("Can't find role: " + roleName));
	}

	private Long doDelete(UserCrudCommand command) {
		User user = loadRequiredUser(command);
		userRepository.delete(user);
		return user.getId();
	}
}
