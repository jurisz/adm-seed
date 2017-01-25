package org.juz.seed.api.enity;

public class SortOption {

	public enum Direction {
		ASC, DESC
	}

	private String propertyName;
	private Direction direction = Direction.DESC;

	public SortOption() {
	}

	public SortOption(String propertyName, Direction direction) {
		this.propertyName = propertyName;
		this.direction = direction;
	}

	public String getPropertyName() {
		return propertyName;
	}

	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}

	public Direction getDirection() {
		return direction;
	}

	public void setDirection(Direction direction) {
		this.direction = direction;
	}
}
