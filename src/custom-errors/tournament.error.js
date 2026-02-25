export class InvalidNumberOfPlayerError extends Error {
	statusCode = 400;

	constructor() {
		super(
			"Minimum number of players cannot be greater than maximum number of players.",
		);
	}
}

export class InvalidEloError extends Error {
	statusCode = 400;

	constructor() {
		super("Minimum ELO cannot be greater than maximum ELO.");
	}
}

export class InvalidEndRegistrationDateError extends Error {
	statusCode = 400;

	constructor() {
		super(
			"End registration date must be at least the current date plus the minimum number of players in days.",
		);
	}
}
