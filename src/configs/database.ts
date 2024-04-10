import { Sequelize, Dialect } from "sequelize";

import { initUser } from "@models/user";
import { initBoard } from "@models/board";
import { initPost, relationPost } from "@models/post";
import { initFile, relationFile } from "@models/file";
import { initComment, relationComment } from "@models/comment";

const DBConfigs = {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres1234",
    database: process.env.DB_DBNAME || "secret",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
};

export default class Database {
    private static instance: Database;
    private sequelizeInstance: Sequelize | null;

    private constructor() {
        this.sequelizeInstance = null;
    }

    public async initializeDB(): Promise<void> {
        try {
            if (!this.sequelizeInstance) {
                this.sequelizeInstance = new Sequelize(DBConfigs.database, DBConfigs.username, DBConfigs.password, {
                    host: DBConfigs.host,
                    dialect: DBConfigs.dialect as Dialect,
                    logging: false,
                    define: {
                        underscored: true,
                    },
                });
            }

            // model init
            initUser(this.sequelizeInstance);
            initBoard(this.sequelizeInstance);
            initPost(this.sequelizeInstance);
            initFile(this.sequelizeInstance);
            initComment(this.sequelizeInstance);

            // relation init
            relationPost();
            relationComment();
            relationFile();

            // await this.sequelizeInstance.sync();
            await this.sequelizeInstance.sync({ logging: false });
        } catch (err: any) {
            throw err;
        }
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public getSequelize(): Sequelize {
        if (!this.sequelizeInstance) {
            throw new Error("Sequelize instance has not been initialized.");
        }
        return this.sequelizeInstance;
    }
}
