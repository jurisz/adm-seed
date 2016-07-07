package org.juz.seed.web.security;

import org.juz.common.config.Profiles;
import org.juz.seed.base.security.Permissions;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.stereotype.Component;

@Component
@Profile({Profiles.Test, Profiles.Development})
public class InMemoryUsersConfigurator implements AuthenticationProfileConfigurer {

	public void registerGlobal(AuthenticationManagerBuilder authBuilder) throws Exception {
		authBuilder.inMemoryAuthentication()
				.withUser("test").password("test").roles(Permissions.ADMIN)
				.and()
				.withUser("test1").password("test1").roles(Permissions.ADMIN);
	}
}
