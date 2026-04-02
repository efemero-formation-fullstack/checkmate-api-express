export class MemberListingDto {
	id;
	username;
	birthdate;
	gender;
	elo;

	constructor(member) {
		this.id = member.id;
		this.username = member.username;
		this.birthdate = member.birthdate;
		this.gender = member.gender;
		this.elo = member.elo;
	}
}

export class MemberDto {
	id;
	username;
	email;
	birthdate;
	gender;
	elo;
	role;

	constructor(member) {
		this.id = member.id;
		this.username = member.username;
		this.email = member.email;
		this.birthdate = member.birthdate;
		this.gender = member.gender;
		this.elo = member.elo;
		this.role = member.role;
	}
}
