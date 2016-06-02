package org.juz.seed.base.security;

import org.juz.common.persistence.BaseRepository;

import java.util.Optional;

public interface RoleRepository extends BaseRepository<Role, Long> {

	Optional<Role> findByName(String roleName);
}
