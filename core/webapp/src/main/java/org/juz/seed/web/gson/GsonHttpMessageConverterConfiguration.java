package org.juz.seed.web.gson;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.juz.common.api.NonPrintable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.GsonHttpMessageConverter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class GsonHttpMessageConverterConfiguration {

	@Bean
	public GsonHttpMessageConverter gsonHttpMessageConverter() {
		GsonHttpMessageConverter converter = new GsonHttpMessageConverter();

		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.registerTypeAdapter(LocalDateTime.class, new LocalDateTimeGsonSerializer());
		gsonBuilder.registerTypeAdapter(LocalDate.class, new LocalDateGsonSerializer());
		gsonBuilder.registerTypeAdapter(NonPrintable.class, new NonPrintableGsonDeserializer());

		Gson gson = gsonBuilder.create();

		converter.setGson(gson);
		return converter;
	}

}