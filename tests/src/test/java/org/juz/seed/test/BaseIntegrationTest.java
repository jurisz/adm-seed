package org.juz.seed.test;

import org.junit.runner.RunWith;
import org.juz.acceptance.AcceptanceTestConfiguration;
import org.juz.acceptance.AcceptanceTestSpringBootConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {AcceptanceTestConfiguration.class})
public abstract class BaseIntegrationTest {

	@Autowired
	public AcceptanceTestSpringBootConfigurer springBootApp;
}
