package org.juz.seed.web.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
@EnableGlobalAuthentication
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Order(1)
public class BaseWebSecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	private AuthenticationProfileConfigurer authenticationProfileConfigurer;

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers(
				"/static/**",
				"/api/public/**",
				"/api/admin/login",
				"/status/ping"
		);
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests().anyRequest().authenticated()
				.and().exceptionHandling().authenticationEntryPoint(http403ForbiddenEntryPoint())
				.and().formLogin().loginPage("/login.html").failureUrl("/login.html?login_error=1").loginProcessingUrl("/login").permitAll()
				.and().logout().logoutUrl("/logout").logoutSuccessHandler(logoutSuccessHandler())
				.and().httpBasic().realmName("backoffice")
				.and().csrf().disable();
	}

	@Bean
	AuthenticationEntryPoint http403ForbiddenEntryPoint() {
		return new Http403ForbiddenEntryPoint();
	}

	private LogoutSuccessHandler logoutSuccessHandler() {
		return (request, response, authentication) -> {
			//no redirects
		};
	}

	@Autowired
	public void registerGlobal(AuthenticationManagerBuilder authBuilder) throws Exception {
		authenticationProfileConfigurer.registerGlobal(authBuilder);
	}
}
