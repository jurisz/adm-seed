package org.juz.seed.test;

import org.junit.Test;
import org.juz.acceptance.AcceptanceRestTemplate;
import org.juz.common.api.UserLoginBean;
import org.juz.common.infra.restclient.RestTemplateFactoryBean;
import org.juz.common.test.util.HttpStatusErrorExceptionUtils;
import org.juz.seed.base.security.Permissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;

public class BackofficeLoginTest extends BaseIntegrationTest {

	@Autowired
	private AcceptanceRestTemplate acceptanceRestTemplate;

	private RestTemplate restTemplate = createTemplateWithoutBasicAuth();

	public BackofficeLoginTest() throws Exception {
	}

	private RestTemplate createTemplateWithoutBasicAuth() throws Exception {
		RestTemplateFactoryBean factoryBean = new RestTemplateFactoryBean()
				.withEnableLoggingFilter(true);
		factoryBean.afterPropertiesSet();
		return factoryBean.getObject();
	}

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

	@Test
	public void isLoggedInCheck() throws Exception {
		String loggedInUrl = acceptanceRestTemplate.baseUrl() + "/api/admin/loggedin";

		//when: first logout, other test may be logged in
		logout();

		String isLoggedIn = restTemplate.getForObject(loggedInUrl, String.class);
		assertThat(isLoggedIn, is("false"));

		login("test", "test");

		isLoggedIn = restTemplate.getForObject(loggedInUrl, String.class);
		assertThat(isLoggedIn, is("true"));

		//when: logout
		logout();

		isLoggedIn = restTemplate.getForObject(loggedInUrl, String.class);
		assertThat(isLoggedIn, is("false"));
	}

	@Test
	public void afterLoginCanGetUserName() throws Exception {
		logout();

		String userNameUrl = acceptanceRestTemplate.baseUrl() + "/api/admin/loggedin/username";

		String errorMessage = HttpStatusErrorExceptionUtils.requireErrorWithMessage(() ->
				restTemplate.getForObject(userNameUrl, String.class));
		assertThat(errorMessage, containsString("\"Access Denied\""));

		login("test", "test");

		String userName = restTemplate.getForObject(userNameUrl, String.class);
		assertThat(userName, is("test"));
	}

	@SuppressWarnings("unchecked")
	private Set<String> login(String user, String pass) {
		String url = acceptanceRestTemplate.baseUrl() + "/api/admin/login";
		UserLoginBean userBean = new UserLoginBean();
		userBean.setName(user);
		userBean.setPassword(pass);

		return restTemplate.postForObject(url, userBean, Set.class);
	}

	private void logout() {
		String logoutUrl = acceptanceRestTemplate.baseUrl() + "/api/admin/logout";
		restTemplate.getForObject(logoutUrl, String.class);
	}
}
