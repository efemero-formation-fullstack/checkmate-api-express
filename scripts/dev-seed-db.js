import "dotenv/config";
import db from "../src/database/index.js";
import memberService from "../src/services/member.service.js";
import tournamentService from "../src/services/tournament.service.js";

const seedDatabase = async () => {
	try {
		console.log("Connecting to the database...");
		await db.sequelize.authenticate();
		console.log("Connection has been established successfully.");

		console.log("Syncing database (force: true)...");
		await db.sequelize.sync({ force: true });
		console.log("Database synced.");

		console.log("Seeding categories...");
		await db.Category.create({
			name: "Senior",
			ageMin: 60,
			ageMax: 999,
		});
		await db.Category.create({
			name: "Adult",
			ageMin: 18,
			ageMax: 60,
		});
		await db.Category.create({
			name: "Junior",
			ageMin: 0,
			ageMax: 18,
		});

		console.log("Seeding members...");
		const password = "Test1234=";

		const memberAdmin = await memberService.create({
			username: "admin",
			email: "admin@admin.local",
			password: password,
			birthdate: "1980-01-01",
			gender: "O",
			elo: 1500,
		});

		memberAdmin.role = "admin";
		await memberAdmin.save();

		const memberJohn = await memberService.create({
			username: "joueur1",
			email: "joueur1@user.local",
			password: password,
			birthdate: "1990-05-15",
			gender: "M",
			elo: 1200,
		});

		const memberJane = await memberService.create({
			username: "joueur2",
			email: "joueur2@user.local",
			password: password,
			birthdate: "1995-10-20",
			gender: "F",
			elo: 1600,
		});

		const memberJunior = await memberService.create({
			username: "joueur3",
			email: "joueur3@user.local",
			password: password,
			birthdate: "2010-03-10",
			gender: "M",
			elo: 1100,
		});

		const memberJunior2 = await memberService.create({
			username: "joueur4",
			email: "joueur4@user.local",
			password: password,
			birthdate: "2010-03-10",
			gender: "M",
			elo: 1100,
		});

		const memberJunior3 = await memberService.create({
			username: "joueur5",
			email: "joueur5@user.local",
			password: password,
			birthdate: "2010-03-10",
			gender: "M",
			elo: 1100,
		});

		const memberJunior4 = await memberService.create({
			username: "joueur6",
			email: "joueur6@user.local",
			password: password,
			birthdate: "2010-03-10",
			gender: "M",
			elo: 1100,
		});

		console.log("Seeding tournaments...");
		const tournament1 = await tournamentService.create({
			name: "tournament1",
			minPlayers: 2,
			maxPlayers: 32,
			endRegistrationDate: "2026-06-30",
			categories: [1, 2, 3],
			elo: 1000,
		});

		console.log("Adding player to tournament");
		await tournament1.addPlayer(memberJohn);
		await tournament1.addPlayer(memberJane);
		await tournament1.addPlayer(memberJunior);
		await tournament1.addPlayer(memberJunior2);
		await tournament1.addPlayer(memberJunior3);
		await tournament1.addPlayer(memberJunior4);

		console.log("Database seeded successfully!");
	} catch (error) {
		console.error("Error seeding the database:", error);
	} finally {
		console.log("Closing database connection...");
		await db.sequelize.close();
	}
};

seedDatabase().then(() => process.exit(0));
