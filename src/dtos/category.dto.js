export class CategoryListingDto {
	id;
	name;

	constructor(category) {
		this.id = category.id;
		this.name = category.name;
	}
}

export class CategoryDetailsDto {
	id;
	name;
	ageMin;
	ageMax;

	constructor(category) {
		this.id = category.id;
		this.name = category.name;
		this.ageMin = category.ageMin;
		this.ageMax = category.ageMax;
	}
}
