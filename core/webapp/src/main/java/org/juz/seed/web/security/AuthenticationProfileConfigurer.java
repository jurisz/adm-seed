package org.juz.seed.web.security;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

public interface AuthenticationProfileConfigurer {

	void registerGlobal(AuthenticationManagerBuilder authBuilder) throws Exception;
}
