import * as log4js from "log4js";

export interface IMongoConfig {
    host: string;
    port: number;
    database: string;
    username?: string;
    password?: string;
}

export interface IConfig {
    port: number;
    secure?: boolean;
    keyPath?: string;
    certPath?: string;
    mongo: IMongoConfig;
    log?: log4js.AppenderConfig[];
}