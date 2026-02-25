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

export class InvalidCredentialError extends Error {
	statusCode = 400;

	constructor() {
		super("Invalid username/email or password");
	}
}
