export class MatchNotFoundError extends Error {
	constructor() {
		super("Match not found");
		this.name = "MatchNotFoundError";
	}
}
