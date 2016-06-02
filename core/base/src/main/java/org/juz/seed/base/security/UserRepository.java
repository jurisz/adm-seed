package org.juz.seed.base.security;

import org.juz.common.persistence.BaseRepository;

import java.util.Optional;

public interface UserRepository extends BaseRepository<User, Long> {

	Optional<User> findByUsername(String username);
}
