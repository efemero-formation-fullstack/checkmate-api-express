export class EmailAlreadyExistsError extends Error {
	statusCode = 400;

	constructor() {
		super("Email already exists");
	}
}

export class UsernameAlreadyExistsError extends Error {
	statusCode = 400;

	constructor() {
		super("Username already exists");
	}
}
