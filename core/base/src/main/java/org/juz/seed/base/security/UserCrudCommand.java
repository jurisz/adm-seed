package org.juz.seed.base.security;

import org.juz.common.api.Command;
import org.juz.common.command.CrudOperation;

public class UserCrudCommand implements Command {
	private CrudOperation operation;
	private Long id;
	private String username;
	private String roleName;

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

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
}
