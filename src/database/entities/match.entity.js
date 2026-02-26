import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const Match = sequelize.define("Match", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	round: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	result: {
		type: DataTypes.ENUM("white_win", "black_win", "draw", "bye"),
		allowNull: true,
	},
});

export default Match;
