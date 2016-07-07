package org.juz.seed.test;

import org.junit.Test;
import org.juz.acceptance.AcceptanceRestTemplate;
import org.juz.common.api.UserLoginBean;
import org.juz.common.test.util.HttpStatusErrorExceptionUtils;
import org.juz.seed.base.security.Permissions;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;

public class BackofficeLoginTest extends BaseIntegrationTest {

	@Autowired
	private AcceptanceRestTemplate acceptanceRestTemplate;

	@Test
	public void successfulLogin() throws Exception {

		Set<String> roles = login("test", "test");

		assertThat(roles, hasSize(1));
		assertThat(roles, hasItem(Permissions.ADMIN));
	}

	@Test
	public void loginFailed() throws Exception {
		String errorMessage = HttpStatusErrorExceptionUtils.requireErrorWithMessage(() -> login("bla", "bla"));
		assertThat(errorMessage, is("\"login failed\""));
	}

	@SuppressWarnings("unchecked")
	private Set<String> login(String user, String pass) {
		String url = acceptanceRestTemplate.baseUrl() + "/api/admin/login";
		UserLoginBean userBean = new UserLoginBean();
		userBean.setName(user);
		userBean.setPassword(pass);

		return acceptanceRestTemplate.restTemplate().postForObject(url, userBean, Set.class);
	}

}
