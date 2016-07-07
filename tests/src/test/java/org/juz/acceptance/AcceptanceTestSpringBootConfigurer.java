package org.juz.acceptance;

import org.juz.common.config.Profiles;
import org.juz.seed.config.PropertiesConfiguration;
import org.juz.seed.web.BootApplication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@Component
public class AcceptanceTestSpringBootConfigurer {

	private static final String API_URL_PROPERTY_NAME = "app.api.url";

	@Value("${" + API_URL_PROPERTY_NAME + ":}")
	private String apiUrl;

	private static BootApplication springBootApp;

	@PostConstruct
	public synchronized void init() throws Throwable {
		if (springBootApp == null && enabledLocalSpringBoot()) {
			startLocalSpringBootApp();
		}
	}

	public String getApiUrl() {
		String remoteWsUrl = getRemoteWsUrl();
		return isNotEmpty(remoteWsUrl) ? remoteWsUrl : getLocalServerUrl();
	}

	private void startLocalSpringBootApp() {
		System.setProperty("net.sf.ehcache.skipUpdateCheck", "true");
		System.setProperty("server.port", "0");
		System.setProperty("application.home", System.getProperty("java.io.tmpdir") + "/" + PropertiesConfiguration.APP_NAME);
		System.setProperty("hibernate.hbm2ddl.auto", "create");
		springBootApp = new BootApplication();
		springBootApp.setAdditionalProfiles(Profiles.Test);
		springBootApp.run(new String[]{});

	}

	public boolean enabledLocalSpringBoot() {
		return isEmpty(getRemoteWsUrl());
	}

	private String getRemoteWsUrl() {
		return apiUrl;
	}

	private String getLocalServerUrl() {
		return "http://localhost:" + springBootApp.getHttpPort();
	}

	public ApplicationContext getLocalSpringContext() {
		return springBootApp.getApplicationContext();
	}

}
