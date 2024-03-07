import { Sequelize, Dialect } from "sequelize";
import { initUser } from "@models/user";
import { initPost } from "@models/post";

const DBConfigs = {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres1234",
    database: process.env.DB_DBNAME || "secret",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
};

let sequelizeInstance: Sequelize | null = null;

const initializeDB = async () => {
    try {
        if (!sequelizeInstance) {
            sequelizeInstance = new Sequelize(DBConfigs.database, DBConfigs.username, DBConfigs.password, {
                host: DBConfigs.host,
                dialect: DBConfigs.dialect as Dialect,
            });
        }

        initUser(sequelizeInstance);
        initPost(sequelizeInstance);

        await sequelizeInstance.sync({ logging: false });
    } catch (err) {
        // TODO: logging
        console.error(err);
    }
};

const getSequelize = (): Sequelize => {
    if (!sequelizeInstance) {
        throw new Error("Sequelize instance has not been initialized.");
    }
    return sequelizeInstance;
};

export { initializeDB, getSequelize };
