package org.juz.seed.web.security;

import org.juz.common.config.Profiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.stereotype.Component;

@Component
@Profile({Profiles.Production})
public class ProdAuthConfigurator implements AuthenticationProfileConfigurer {

	@Autowired
	private AuthenticationProvider provider;

	public void registerGlobal(AuthenticationManagerBuilder authBuilder) throws Exception {
		authBuilder.authenticationProvider(provider);
	}
}
