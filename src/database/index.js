import sequelize from "./config.js";
import Category from "./entities/category.entity.js";
import Member from "./entities/member.entity.js";
import Match from "./entities/match.entity.js";
import Tournament from "./entities/tournament.entity.js";

// Tournament - Category (Many-to-Many)
Tournament.belongsToMany(Category, {
	through: "TournamentCategories",
	as: "categories",
	foreignKey: "tournamentId",
	otherKey: "categoryId",
});
Category.belongsToMany(Tournament, {
	through: "TournamentCategories",
	as: "tournaments",
	foreignKey: "categoryId",
	otherKey: "tournamentId",
});

// Tournament - Member (Many-to-Many)
Tournament.belongsToMany(Member, {
	through: "TournamentMembers",
	as: "players",
	foreignKey: "tournamentId",
	otherKey: "memberId",
});
Member.belongsToMany(Tournament, {
	through: "TournamentMembers",
	as: "tournaments",
	foreignKey: "memberId",
	otherKey: "tournamentId",
});

// Tournament - Match (One-to-Many)
Match.belongsTo(Tournament, {
	as: "tournament",
	foreignKey: {
		name: "tournamentId",
		allowNull: false,
	},
});
Tournament.hasMany(Match, { as: "matches", foreignKey: "tournamentId" });

// Member  -Play White- Match (Many-to-One )
Match.belongsTo(Member, {
	as: "whitePlayer",
	foreignKey: {
		name: "whitePlayerId",
		allowNull: false,
	},
});
Member.hasMany(Match, { as: "whiteMatches", foreignKey: "whitePlayerId" });

// Member  -Play Black- Match (Many-to-One )
Match.belongsTo(Member, {
	as: "blackPlayer",
	foreignKey: {
		name: "blackPlayerId",
		allowNull: false,
	},
});
Member.hasMany(Match, { as: "blackMatches", foreignKey: "blackPlayerId" });

export default {
	sequelize,
	Category,
	Tournament,
	Member,
	Match,
};
