import { CategoryListingDto } from "./category.dto.js";
import { MatchListingDto } from "./match.dto.js";
import { MemberListingDto } from "./member.dto.js";

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
	isRegistered;
	canRegister;

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
		this.isRegistered = tournament.isRegistered;
		this.canRegister = tournament.canRegister;
	}
}

export class TournamentDetailsDto {
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
	players;
	matches;
	currentMatches;
	isRegistered;
	canRegister;

	constructor(tournament) {
		this.id = tournament.id;
		this.name = tournament.name;
		this.location = tournament.location;
		this.nbrOfPlayers = tournament.nbrOfPlayers;
		this.minPlayers = tournament.minPlayers;
		this.maxPlayers = tournament.maxPlayers;
		this.categories = tournament.categories.map(category => category.name);
		this.minElo = tournament.minElo;
		this.maxElo = tournament.maxElo;
		this.status = tournament.status;
		this.endRegistrationDate = tournament.endRegistrationDate;
		this.currentRound = tournament.currentRound;
		this.players = tournament.players.map(
			player => new MemberListingDto(player),
		);
		this.matches = tournament.matches.map(
			match => new MatchListingDto(match),
		);
		this.currentMatches = tournament.matches
			.filter(match => match.round === tournament.currentRound)
			.map(match => new MatchListingDto(match));
		this.isRegistered = tournament.isRegistered;
		this.canRegister = tournament.canRegister;
	}
}
