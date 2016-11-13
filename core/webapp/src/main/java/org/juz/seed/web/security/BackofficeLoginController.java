package org.juz.seed.web.security;

import org.apache.commons.lang3.StringUtils;
import org.juz.common.api.UserLoginBean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.HttpSession;
import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

@Transactional
@RestController
@RequestMapping("/api/admin")
@Scope(WebApplicationContext.SCOPE_SESSION)
public class BackofficeLoginController {

	private static final Logger log = LoggerFactory.getLogger(BackofficeLoginController.class);

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private HttpSession httpSession;

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public Collection<String> login(@RequestBody UserLoginBean user) {
		UsernamePasswordAuthenticationToken authRequest =
				new UsernamePasswordAuthenticationToken(user.getName(), user.getPassword());
		try {
			Authentication authentication = authenticationManager.authenticate(authRequest);
			if (authentication == null) {
				loginFailed();
				throw new AccessDeniedException("login failed");
			}
			loginSuccess(authentication);
			return transformPermissions(authentication);
		} catch (AuthenticationException failed) {
			log.error("Authentication error, error: {}: {}", failed.getClass().getSimpleName(), failed.getMessage());
			loginFailed();
			throw new AccessDeniedException("login failed");
		}
	}

	@RequestMapping(value = "/loggedin", method = RequestMethod.GET)
	public boolean isLoggedin() {
		return isAuthenticated(synchronizeAuthentication());
	}

	private Authentication synchronizeAuthentication() {
		SpringWebSecuritySynchronizationHelper.securityContextHttpSessionSynchronization(httpSession);
		return SecurityContextHolder.getContext().getAuthentication();
	}
	
	@RequestMapping(value = "/loggedin/username", method = RequestMethod.GET)
	public String getCurrentUsername() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return isAuthenticated(authentication) ? authentication.getName() : StringUtils.EMPTY;
	}

	@RequestMapping(value = "/loggedin/permissions", method = RequestMethod.GET)
	public Collection<String> getCurrentUserPermissions() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return isAuthenticated(authentication) ? transformPermissions(authentication) : Collections.emptySet();
	}


	private boolean isAuthenticated(Authentication authentication) {
		return authentication != null && authentication.isAuthenticated();
	}

	private Collection<String> transformPermissions(Authentication authentication) {
		return authentication.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.map(role -> StringUtils.removeStart(role, "ROLE_"))
				.collect(Collectors.toSet());
	}

	private void loginSuccess(Authentication authentication) {
		SpringWebSecuritySynchronizationHelper.securityContextHttpSessionSynchronization(httpSession);
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}

	private void loginFailed() {
		SpringWebSecuritySynchronizationHelper.securityContextHttpSessionSynchronization(httpSession);
		SecurityContextHolder.clearContext();
	}
}
