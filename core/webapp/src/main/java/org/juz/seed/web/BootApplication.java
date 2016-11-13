package org.juz.seed.web;

import org.juz.seed.config.SpringBootApplicationConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.boot.context.embedded.EmbeddedWebApplicationContext;
import org.springframework.boot.system.ApplicationPidFileWriter;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;

@EnableAutoConfiguration(exclude = {JacksonAutoConfiguration.class})
public class BootApplication {

	private String[] additionalProfiles;

	private ConfigurableApplicationContext applicationContext;

	public static void main(String[] args) {
		new BootApplication().run(args);
	}

	public void run(String[] args) {
		SpringApplication application = new SpringApplication(BootApplication.class, SpringBootApplicationConfiguration.class);
		if (additionalProfiles != null) {
			application.setAdditionalProfiles(additionalProfiles);
		}
		application.addListeners(new ApplicationPidFileWriter());
		applicationContext = application.run(args);
	}

	public int getHttpPort() {
		return ((EmbeddedWebApplicationContext) applicationContext).getEmbeddedServletContainer().getPort();
	}

	public void setAdditionalProfiles(String... additionalProfiles) {
		this.additionalProfiles = additionalProfiles;
	}

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}
}
