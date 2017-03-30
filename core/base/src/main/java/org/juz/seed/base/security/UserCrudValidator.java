package org.juz.seed.base.security;

import org.apache.commons.lang3.StringUtils;
import org.juz.common.api.ValidationError;
import org.juz.common.command.CommandValidator;
import org.juz.common.command.CrudOperation;
import org.juz.common.command.Validator;
import org.springframework.stereotype.Component;

import java.util.Set;

import static com.google.common.collect.Sets.newHashSet;

@Component
class UserCrudValidator implements CommandValidator<UserCrudCommand> {

	private RoleRepository roleRepository;

	public UserCrudValidator(RoleRepository roleRepository) {
		this.roleRepository = roleRepository;
	}

	@Override
	public Set<ValidationError> validate(UserCrudCommand command) {
		Set<ValidationError> result = newHashSet();
		if (isUpdateOrCreate(command)) {
			if (StringUtils.isBlank(command.getUsername())) {
				result.add(new ValidationError("username", Validator.ERROR_REQUIRED));
			}
			if (StringUtils.isBlank(command.getRoleName())) {
				result.add(new ValidationError("roleName", Validator.ERROR_REQUIRED));
			}
		}
		return result;
	}

	private boolean isUpdateOrCreate(UserCrudCommand command) {
		return command.getOperation() == CrudOperation.UPDATE ||
				command.getOperation() == CrudOperation.CREATE;
	}
}
