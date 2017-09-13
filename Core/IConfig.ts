/*
*   This file is part of the carMeet project.
*
*   This program is licensed under the GNU General
*   Public License. To view the full license, check
*   LICENSE in the project root.
*/

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
    mongo: IMongoConfig;
    log?: log4js.IConfig;
}