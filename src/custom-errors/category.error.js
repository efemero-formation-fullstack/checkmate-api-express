export class CategoryNotFoundError extends Error {
	statusCode = 400;

	constructor() {
		super(
			"One or more categories not found. Please check the category IDs and try again.",
		);
	}
}
