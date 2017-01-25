package org.juz.seed.app;

import org.juz.seed.base.security.Role;
import org.juz.seed.base.security.RoleRepository;
import org.juz.seed.base.security.User;
import org.juz.seed.base.security.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
class DbDataInitializer implements ApplicationListener<ContextRefreshedEvent> {

	private static final Logger log = LoggerFactory.getLogger(DbDataInitializer.class);

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		initTestUserList();
	}

	private void initTestUserList() {
		log.info("persisting test user list of 105");

		Role role = new Role();
		role.setName("Any");
		roleRepository.save(role);

		for (int i = 1; i < 105; i++) {
			User user = new User();
			user.setUsername("user_" + i);
			user.setRole(role);
			userRepository.save(user);
		}
	}
}
