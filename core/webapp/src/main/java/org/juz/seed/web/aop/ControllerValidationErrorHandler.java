package org.juz.seed.web.aop;

import org.juz.common.api.ValidationResult;
import org.juz.common.command.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ControllerValidationErrorHandler {

	private static final Logger log = LoggerFactory.getLogger(ControllerValidationErrorHandler.class);

	@ExceptionHandler(ValidationException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ValidationResult processValidationError(ValidationException validationException) {
		log.warn("Validation error: {}", validationException.getMessage());
		return validationException.getValidationResult();
	}
}
