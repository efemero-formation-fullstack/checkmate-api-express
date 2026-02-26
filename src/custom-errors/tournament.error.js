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

export class TournamentNotFoundError extends Error {
	statusCode = 404;

	constructor() {
		super("Tournament not found.");
	}
}

export class RegistrationClosedError extends Error {
	statusCode = 400;

	constructor() {
		super("Tournament registration is closed.");
	}
}

export class TournamentIsWomenOnlyError extends Error {
	statusCode = 400;

	constructor() {
		super("Tournament is women only.");
	}
}

export class PlayerIsOutOfEloRangeError extends Error {
	statusCode = 400;

	constructor() {
		super("Player's ELO is out of the tournament's ELO range.");
	}
}

export class PlayerAlreadyRegisteredError extends Error {
	statusCode = 400;

	constructor() {
		super("Player is already registered for this tournament.");
	}
}

export class PlayerIsOutOfTheCategoriesError extends Error {
	statusCode = 400;

	constructor() {
		super("Player does not belong to any of the tournament's categories.");
	}
}

export class TournamentAlreadyStartedError extends Error {
	statusCode = 400;

	constructor() {
		super("Tournament has already started.");
	}
}

export class TournamentIsFullError extends Error {
	statusCode = 400;

	constructor() {
		super("Tournament is already full.");
	}
}

export class PlayerNotRegisteredToTournamentError extends Error {
	statusCode = 400;

	constructor() {
		super("Player is not registered for this tournament.");
	}
}

export class TournamentIsNotRunningError extends Error {
	statusCode = 400;

	constructor() {
		super("Tournament is not currently running.");
	}
}

export class NotAllMatchesHaveAResultError extends Error {
	statusCode = 400;

	constructor() {
		super("Not all matches have a result.");
	}
}

export class TournamentNotStartedError extends Error {
	statusCode = 400;

	constructor() {
		super("Tournament has not started yet.");
	}
}
