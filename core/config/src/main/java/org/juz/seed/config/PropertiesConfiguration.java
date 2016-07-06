package org.juz.seed.config;

import org.juz.common.config.Profiles;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.Resource;

@Configuration
@Profile({Profiles.Production, Profiles.Development})
public class PropertiesConfiguration {

	public static final String APP_NAME = "adm-seed";
	public static final String APP_PROPERTY_FILE_NAME = APP_NAME + ".properties";

	@Bean
	public static PropertySourcesPlaceholderConfigurer propsConfiguration(
			@Value("classpath:" + APP_PROPERTY_FILE_NAME) Resource defaultProps,
			@Value("file:///${application.home}/" + APP_PROPERTY_FILE_NAME) Resource applicationProps,
			ConfigurableApplicationContext applicationContext) {

		PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
		configurer.setLocations(new Resource[]{defaultProps, applicationProps});

		configurer.setIgnoreResourceNotFound(true);

		return configurer;
	}
}
