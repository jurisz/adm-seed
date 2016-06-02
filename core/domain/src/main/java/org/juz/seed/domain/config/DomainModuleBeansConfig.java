package org.juz.seed.domain.config;

import org.juz.common.command.EmailValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class DomainModuleBeansConfig {

	@Bean
	public EmailValidator emailValidator() {
		return new EmailValidator();
	}
}
