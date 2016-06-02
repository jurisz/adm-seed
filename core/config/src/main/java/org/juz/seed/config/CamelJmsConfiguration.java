package org.juz.seed.config;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.camel.component.jms.JmsComponent;
import org.apache.camel.component.jms.JmsConfiguration;
import org.apache.camel.spring.javaconfig.CamelConfiguration;
import org.juz.common.config.Profiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jms.connection.CachingConnectionFactory;

import javax.jms.ConnectionFactory;

@Configuration
class CamelJmsConfiguration extends CamelConfiguration {

	@Bean
	@Autowired
	public ConnectionFactory connectionFactory(@Value("${activemq.brokerUrl}") String brokerUrl,
											   @Value("${jms.cache:10}") int cacheSize,
											   Environment environment
	) {

		ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(brokerUrl);
		connectionFactory.setTrustAllPackages(true);
		CachingConnectionFactory cachingConnectionFactory = new CachingConnectionFactory(connectionFactory);
		cachingConnectionFactory.setSessionCacheSize(cacheSize);
		if (environment.acceptsProfiles(Profiles.Test)) {
			cachingConnectionFactory.setReconnectOnException(false);
		}
		return cachingConnectionFactory;
	}

	@Bean
	@Autowired
	public JmsConfiguration jmsConfiguration(ConnectionFactory connectionFactory) {
		JmsConfiguration jmsConfiguration = new JmsConfiguration(connectionFactory);
		jmsConfiguration.setTransacted(false);
		return jmsConfiguration;
	}

	@Bean
	@Autowired
	public JmsComponent jmstx(JmsConfiguration jmsConfiguration) {
		return new JmsComponent(jmsConfiguration);
	}
}
