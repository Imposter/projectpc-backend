import * as log4js from "log4js";

export interface IMongoConfig {
    host: string;
    port: number;
    database: string;
    username?: string;
    password?: string;
}

export interface IConfig {
    maxWorkers?: number;
    port: number;
    secure?: boolean;
    keyPath?: string;
    certPath?: string;
    behindProxy?: boolean;
    sessionSecret: string;
    sessionTimeout?: number;
    mongo: IMongoConfig;
    log?: log4js.IConfig;
}