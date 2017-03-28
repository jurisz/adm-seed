package org.juz.seed.base.security;

import org.juz.common.api.ValidationError;
import org.juz.common.command.CommandValidator;
import org.juz.common.command.CrudOperation;
import org.juz.common.command.Validator;
import org.springframework.stereotype.Component;

import java.util.Set;

import static com.google.common.collect.Sets.newHashSet;

@Component
class RoleCrudValidator implements CommandValidator<RoleCrudCommand> {

	@Override
	public Set<ValidationError> validate(RoleCrudCommand command) {
		Set<ValidationError> result = newHashSet();
		if (command.getOperation() == CrudOperation.UPDATE ||
				command.getOperation() == CrudOperation.CREATE) {
			result.add(new ValidationError("name", Validator.ERROR_REQUIRED));
		}
		return result;
	}
}
