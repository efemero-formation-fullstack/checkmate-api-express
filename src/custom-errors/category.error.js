export class CategoryNotFoundError extends Error {
	statusCode = 404;

	constructor() {
		super(
			"One or more categories not found. Please check the category IDs and try again.",
		);
	}
}
