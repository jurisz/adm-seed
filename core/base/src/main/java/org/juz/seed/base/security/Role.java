package org.juz.seed.base.security;

import org.hibernate.envers.Audited;
import org.juz.common.persistence.model.BaseEntity;
import org.juz.seed.api.security.RoleBean;
import org.springframework.beans.BeanUtils;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Audited
@Entity
@Table(name = "roles",
		indexes = {
				@Index(name = "idx_role_name", columnList = "name", unique = true)
		}
)
@SequenceGenerator(name = "seq_gen", sequenceName = "roles_seq", allocationSize = 1)
public class Role extends BaseEntity {

	@Column(name = "name", nullable = false, length = 100, unique = true)
	private String name;

	@ElementCollection(fetch = FetchType.LAZY)
	@Column(name = "permission", nullable = false)
	private Set<String> permissions = new HashSet<>();

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

	public RoleBean toBean() {
		RoleBean bean = new RoleBean();
		BeanUtils.copyProperties(this, bean);
		return bean;
	}
}
