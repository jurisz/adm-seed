package org.juz.seed.base.security;

import org.juz.common.api.Command;
import org.juz.common.command.CrudOperation;

import java.util.Set;

public class RoleCrudCommand implements Command {
	private CrudOperation operation;
	private Long id;
	private String name;
	private Set<String> permissions;

	public CrudOperation getOperation() {
		return operation;
	}

	public void setOperation(CrudOperation operation) {
		this.operation = operation;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<String> getPermissions() {
		return permissions;
	}

	public void setPermissions(Set<String> permissions) {
		this.permissions = permissions;
	}
}
