﻿import { IConfig } from "./IConfig";
import ClusterManager from "./Utility/ClusterManager";
import AuthChecker from "./Core/AuthChecker";
import Storage from "./Utility/Storage";
import "reflect-metadata";
import * as rc from "routing-controllers";
import * as mongoose from "mongoose";
import * as log4js from "log4js";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as express from "express";
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const v4 = require("uuid/v4");

// Get environment
var environment = process.env.NODE_ENV || "dev";

// Load config
const config: IConfig = require(`./config-${environment}.json`);

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

		log.info(`Connected to MongoDB: ${config.mongo.host}:${config.mongo.port}`);
	} catch (error) {
		log.error(`Failed to connect to MongoDB: ${error}`);
		return;
	}

	// Create express app and server depending on config
	var app = express();
	var server = null;
	if (!config.secure) {
		server = http.createServer(app);
	} else {
		var key = config.keyPath == null ? new Buffer("") : fs.readFileSync(config.keyPath);
		var cert = config.certPath == null ? new Buffer("") : fs.readFileSync(config.certPath);

		this.server = https.createServer({
			key: this.key,
			cert: this.cert,
			requestCert: true
		}, this.app);
	}

	// Initialize storage
	Storage.Initialize(`file://${__dirname}/${config.imagePath}`);	

	// Trust proxy if behind one
	if (config.behindProxy) {
		app.set("trust proxy", 1);
	}

	// Hook body-parser to avoid body size limits, set cap to 50MB
	let bodyParserJson = bodyParser.json;
	Object.defineProperty(bodyParser, 'json', {
		configurable: true,
		enumerable: true,
		get: function() {
			return function(options) {
				if (options == null) options = {};
				options.limit = "50mb";
				return bodyParserJson(options);
			};
		}
	});

	// Global middleware
	app.use((error: Error, request: express.Request, response: express.Response, next: (error: any) => any) => {
		log.error(`Express error: ${error.stack}`);
		next(error);
	});
	app.use(mongoSanitize());
	app.use(session({
		genid: () => v4(),
		secret: config.sessionSecret,
		resave: false,
		unset: "destroy",
		saveUninitialized: false,
		name: "session_id",
		cookie: { 
			secure: config.secure || config.behindProxy,
			maxAge: config.sessionTimeout // Standard: 86400000
		},
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			collection: "sessions"
		})
	}));
		
	// Apply routing config to express app
	rc.useExpressServer(app, {
		controllers: [ `${__dirname}/Controllers/**/*.js` ],
		middlewares: [ `${__dirname}/Middlewares/**/*.js` ],
		routePrefix: "/api",
		authorizationChecker: AuthChecker,
		defaultErrorHandler: false,
		development: environment === "dev",
		defaults: {
			paramOptions: {
				// Require request parameters
				required: true
			}	
		}
	});

	// Start listening on port
	server.listen(config.port);

	log.info(`Server is running on port ${config.port}`);
}

// Manage cluster
if (ClusterManager.IsMasterWorker()) {
    log.info("Initializing cluster...");
    ClusterManager.Initialize();

    var threadCount = ClusterManager.GetCPUThreads();
    log.info(`CPU threads: ${threadCount}`);
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
	// Execute entrypoint
    main();
}