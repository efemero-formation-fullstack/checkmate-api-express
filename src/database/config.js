import { Sequelize } from "sequelize";

const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;

// exemple connection via URL
// postgresql://user:password@localhost:5432/database_name
const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
	host: PG_HOST,
	port: PG_PORT,
	dialect: "postgres",
});

export default sequelize;
