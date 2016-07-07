package org.juz.seed.mock;

import org.juz.common.config.Profiles;
import org.juz.seed.config.PropertiesConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.Resource;

@Configuration
@Profile(Profiles.Test)
public class TestPropertiesConfiguration {

	@Bean
	public static PropertySourcesPlaceholderConfigurer propsConfiguration(@Value("classpath:" + PropertiesConfiguration.APP_PROPERTY_FILE_NAME) Resource defaultProps,
																		  @Value("classpath:" + PropertiesConfiguration.APP_NAME + "-test.properties") Resource testingProps) {
		PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
		configurer.setLocations(defaultProps, testingProps);
		return configurer;
	}
}
