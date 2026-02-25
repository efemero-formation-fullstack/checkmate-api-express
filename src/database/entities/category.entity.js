import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const Category = sequelize.define(
	"Category",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ageMin: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		ageMax: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	},
);

export default Category;
