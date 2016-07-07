package org.juz.acceptance;


import org.juz.common.infra.restclient.RestTemplateFactoryBean;
import org.juz.seed.web.gson.GsonHttpMessageConverterConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.http.converter.json.GsonHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
@ComponentScan(basePackages = {"org.juz.acceptance"})
public class AcceptanceTestConfiguration {

	private static final String TEST_USER = "test";
	private static final String TEST_PASS = "test";

	@Bean
	public RestTemplate acceptanceRestClient() throws Exception {
		RestTemplateFactoryBean factoryBean = new RestTemplateFactoryBean()
				.withBasicAuthUsername(TEST_USER)
				.withBasicAuthPassword(TEST_PASS)
				.withEnableLoggingFilter(true)
				.withMessageConverter(customGsonConverter());
		factoryBean.afterPropertiesSet();

		return factoryBean.getObject();
	}

	private GsonHttpMessageConverter customGsonConverter() {
		return new GsonHttpMessageConverterConfiguration().gsonHttpMessageConverter();
	}

	@Bean
	public static PropertySourcesPlaceholderConfigurer propsConfiguration() {
		return new PropertySourcesPlaceholderConfigurer();
	}
}