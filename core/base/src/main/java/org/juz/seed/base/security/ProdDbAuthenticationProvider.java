package org.juz.seed.base.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

import static java.util.stream.Collectors.toSet;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.lowerCase;

public class ProdDbAuthenticationProvider implements AuthenticationProvider {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		final UsernamePasswordAuthenticationToken userToken = (UsernamePasswordAuthenticationToken) authentication;

		String username = userToken.getName();
		String password = (String) authentication.getCredentials();

		if (isBlank(username)) {
			throw new BadCredentialsException("No username");
		}
		if (isBlank(password)) {
			throw new BadCredentialsException("No password");
		}

		UsernamePasswordAuthenticationToken result = authenticate(username, password);
		result.setDetails(userToken.getDetails());
		return result;
	}

	private UsernamePasswordAuthenticationToken authenticate(String username, String password) {
		User user = requireDbUser(lowerCase(username));

		String encodedPassword = user.getPassword();
		if (isBlank(encodedPassword) || !passwordEncoder.matches(password, encodedPassword)) {
			throw new BadCredentialsException("login failed");
		}

		Role dbRole = user.getRole();
		if (dbRole == null) {
			throw new BadCredentialsException("User without role");
		}

		return new UsernamePasswordAuthenticationToken(
				username,
				null,
				getAuthoritiesFromRole(dbRole));
	}

	private User requireDbUser(String userName) {
		return userRepository.findByUsername(userName)
				.orElseThrow(() -> new BadCredentialsException("Login failed"));
	}

	private Set<GrantedAuthority> getAuthoritiesFromRole(Role role) {
		return role.getPermissions().stream()
				.map(permission -> new SimpleGrantedAuthority("ROLE_" + permission))
				.collect(toSet());
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
	}
}
