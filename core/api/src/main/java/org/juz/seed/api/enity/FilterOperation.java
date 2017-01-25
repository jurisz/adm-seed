package org.juz.seed.api.enity;

public interface FilterOperation {

	String EQ = "=";

	String LT = "<";

	String LE = "<=";

	String GT = ">";

	String GE = ">=";

	String NE = "<>";

	String IS_NULL = "is null";

	String IS_NOT_NULL = "is not null";

	String STARTS_WITH = "starts with";

	String CONTAIN = "contain";

	String NOT_CONTAIN = "not contain";

	String BETWEEN = "between";

	String IN = "in";
}
