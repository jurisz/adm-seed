package org.juz.seed.config;

import com.google.common.collect.Lists;
import org.juz.common.config.ScanPersistencePackages;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
class ApplicationPersistenceScan implements ScanPersistencePackages {

	@Override
	public Collection<String> asStrings() {
		return Lists.newArrayList(
				"org.juz.common.persistence.model",
				"org.juz.seed.base.security",
				"org.juz.seed.domain.model"
		);
	}
}
