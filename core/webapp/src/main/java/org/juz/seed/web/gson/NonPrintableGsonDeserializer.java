package org.juz.seed.web.gson;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import org.juz.common.api.NonPrintable;

import java.lang.reflect.Type;

public class NonPrintableGsonDeserializer implements JsonDeserializer<NonPrintable<String>> {

	@Override
	public NonPrintable<String> deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
		return new NonPrintable<String>(json.getAsString());
	}
}