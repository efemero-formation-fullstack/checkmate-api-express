import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const Member = sequelize.define("Member", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	birthdate: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
	gender: {
		type: DataTypes.ENUM("M", "F", "O"),
		allowNull: false,
	},
	elo: {
		type: DataTypes.INTEGER,
		defaultValue: 1200,
		allowNull: false,
	},
	role: {
		type: DataTypes.ENUM("user", "admin"),
		defaultValue: "user",
		allowNull: false,
	},
});

export default Member;
