package org.juz.seed.base.security;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.envers.Audited;
import org.juz.common.persistence.model.BaseEntity;
import org.juz.seed.api.security.UserBean;
import org.springframework.beans.BeanUtils;

import javax.persistence.*;

@Audited
@Entity
@Table(name = "users")
@SequenceGenerator(name = "seq_gen", sequenceName = "users_seq", allocationSize = 1)
public class User extends BaseEntity {

	@Column(name = "user_name", nullable = false, length = 100, unique = true)
	private String username;

	@Column(name = "password", length = 100)
	private String password;

	@ManyToOne(optional = false)
	@JoinColumn(name = "role_id")
	private Role role;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = StringUtils.lowerCase(username);
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public UserBean toBean() {
		UserBean bean = new UserBean();
		BeanUtils.copyProperties(this, bean, "password");
		if (role != null) {
			bean.setRoleName(role.getName());
		}
		return bean;
	}
}
