package org.juz.acceptance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AcceptanceRestTemplate {

	@Autowired
	@Qualifier("acceptanceRestClient")
	private RestTemplate restTemplate;

	@Autowired
	private AcceptanceTestSpringBootConfigurer bootConfigurer;

	public RestTemplate restTemplate() {
		return restTemplate;
	}

	public String baseUrl() {
		return bootConfigurer.getApiUrl();
	}
}
