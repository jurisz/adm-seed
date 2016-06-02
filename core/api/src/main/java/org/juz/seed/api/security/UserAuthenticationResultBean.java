package org.juz.seed.api.security;

import java.util.Set;

public class UserAuthenticationResultBean {

	private String username;

	private Set<String> permissions;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Set<String> getPermissions() {
		return permissions;
	}

	public void setPermissions(Set<String> permissions) {
		this.permissions = permissions;
	}
}
