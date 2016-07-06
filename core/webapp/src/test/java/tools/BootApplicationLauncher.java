package tools;

import org.juz.common.config.Profiles;
import org.juz.seed.config.PropertiesConfiguration;
import org.juz.seed.web.BootApplication;

public class BootApplicationLauncher {

	public static void main(final String[] args) throws Exception {
		System.setProperty("application.home", System.getProperty("user.home") + "/" + PropertiesConfiguration.APP_NAME);
		System.setProperty("net.sf.ehcache.skipUpdateCheck", "true");
		BootApplication springBootApp = new BootApplication();
		springBootApp.setAdditionalProfiles(Profiles.Development);
		springBootApp.run(args);
	}
}
