import { CategoryListingDto } from "./category.dto.js";

export class TournamentListingDto {
	id;
	name;
	location;
	nbrOfPlayers;
	minPlayers;
	maxPlayers;
	categories;
	minElo;
	maxElo;
	status;
	endRegistrationDate;
	currentRound;

	constructor(tournament) {
		this.id = tournament.id;
		this.name = tournament.name;
		this.location = tournament.location;
		this.nbrOfPlayers = tournament.nbrOfPlayers;
		this.minPlayers = tournament.minPlayers;
		this.maxPlayers = tournament.maxPlayers;
		this.categories = tournament.categories.map(
			category => new CategoryListingDto(category),
		);
		this.minElo = tournament.minElo;
		this.maxElo = tournament.maxElo;
		this.status = tournament.status;
		this.endRegistrationDate = tournament.endRegistrationDate;
		this.currentRound = tournament.currentRound;
	}
}

