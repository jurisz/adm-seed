package org.juz.seed.web.security;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

import javax.servlet.http.HttpSession;

public class SpringWebSecuritySynchronizationHelper {

	private SpringWebSecuritySynchronizationHelper() {
	}

	public static void securityContextHttpSessionSynchronization(HttpSession session) {
		SecurityContext securityContext = (SecurityContext) session.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
		if (securityContext != null) {
			SecurityContextHolder.setContext(securityContext);
		} else {
			session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
		}
	}
}
