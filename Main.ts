/*
*   This file is part of the carMeet project.
*
*   This program is licensed under the GNU General
*   Public License. To view the full license, check
*   LICENSE in the project root.
*/

import { IConfig } from "./Core/IConfig";
import ClusterManager from "./Utility/ClusterManager";
import "reflect-metadata";
import * as rc from "routing-controllers";
import * as mongoose from "mongoose";
import * as log4js from "log4js";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as express from "express";
const config: IConfig = require("./config.json");
const mongoSanitize = require("express-mongo-sanitize");

// Initialize logger
log4js.configure(config.log);

const log: log4js.Logger = log4js.getLogger("Main");

// Program entrypoint
async function main() {
	// Configure mongoose
	(<any>mongoose).Promise = global.Promise;

	// Connect to Mongoose server
	try {
		var connectionString = "";
		if (config.mongo.username != null && config.mongo.password != null) {
			connectionString = `mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`;
		} else {
			connectionString = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`;
		}

		await mongoose.connect(connectionString, {
			useMongoClient: true
		});
	} catch (error) {
		log.error(error);
		return;
	}

	var secure = config.secure || false;
	var key = (!secure || config.keyPath == null) ? new Buffer("") : fs.readFileSync(config.keyPath);
	var cert = (!secure || config.certPath == null) ? new Buffer("") : fs.readFileSync(config.certPath);

	// Create express app and server depending on config
	var app = express();
	var server = null;
	if (!secure) {
		server = http.createServer(app);
	} else {
		this.server = https.createServer({
			key: this.key,
			cert: this.cert,
			requestCert: true
		}, this.app);
	}

	// Apply routing config to express app
	rc.useExpressServer(app, {
		controllers: [ `${__dirname}/Controllers/*.js` ],
		routePrefix: "/api",

		// TODO: ...
		authorizationChecker: null,
	});

	// Global middleware
	app.use(mongoSanitize());

	// Start listening on port
	server.listen(config.port);

	log.info(`Server is running on port ${config.port}`);
}

// Manage cluster
if (ClusterManager.IsMasterWorker()) {
    log.info("Initializing cluster...");
    ClusterManager.Initialize();

    // Create shutdown handler
    var shutdownHandler = (error: any) => {
        // Shutdown cluster
        ClusterManager.Shutdown();

        // Print stack trace if necessary
        if (error != null && error.stack != null) {
            log.error(`CRITICAL: ${error.stack}`);
            process.exit(-1);
        }
        process.exit(0);
    };
    process.on("exit", shutdownHandler.bind(null))
        .on("uncaughtException", shutdownHandler.bind(null))
        .on("SIGINT", shutdownHandler.bind(null));

    var threadCount = ClusterManager.GetCPUThreads();
    log.info(`CPU Thread Count: ${threadCount}`);
    if (config.maxWorkers != null && config.maxWorkers != 0) {
        threadCount = threadCount > config.maxWorkers ? config.maxWorkers : threadCount;
    }
    log.info(`Max workers: ${threadCount}`);

    // Create worker for each thread
    for (var i = 0; i < threadCount; i++) {
        var worker = ClusterManager.CreateWorker();
        log.info(`Created worker ${i + 1} (id: ${worker.id}, pid: ${worker.process.pid})`);
    }

    log.info("Master idling...");
} else {
    // Get worker
    var worker = ClusterManager.GetCurrentWorker();

    // Add shutdown handler
    var shutdownHandler = (error: any) => {
        log.info("Shutting down...");

        // Print stack trace if necessary
        if (error != null && error.stack != null) {
            log.error(`CRITICAL: ${error.stack}`);
        }
        ClusterManager.DestroyWorker();
    };
    worker.on("exit", shutdownHandler.bind(null))
        .on("uncaughtException", shutdownHandler.bind(null))
        .on("SIGINT", shutdownHandler.bind(null));

	// Execute entrypoint
    main();
}