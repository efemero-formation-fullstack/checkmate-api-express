import { MemberListingDto } from "./member.dto.js";

export class MatchListingDto {
	id;
	whitePlayer;
	blackPlayer;
	result;
	round;

	constructor(match) {
		this.id = match.id;
		this.whitePlayer = new MemberListingDto(match.whitePlayer);
		this.blackPlayer = new MemberListingDto(match.blackPlayer);
		this.result = match.result;
		this.round = match.round;
	}
}
