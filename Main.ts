import { IConfig } from "./Core/IConfig";
import "reflect-metadata";
import * as rc from "routing-controllers";
import * as mongoose from "mongoose";
const config: IConfig = require("config.json");
const mongoSanitize = require("express-mongo-sanitize");

// test
import { IUserModel, Users } from "./Models/UserModel";

// Program entrypoint
async function main() {
	// TODO: Configure logger

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

		var result = await Users.create(<IUserModel> { // Instead of interfaces, use classes
			name: "Imposter",
			email: "eyaz.rehman@uoit.ca",
			firstName: "Eyaz",
			lastName: "Rehman"
		});
		console.log(result);

		result = await Users.findOne({ name: /Imp/g }); // TODO: In production, use new RegExp(`/${param}/g`); or w.e. the expression is
		console.log(result);
	} catch (error) {
		console.log("ERROR: " + error);
	}

	// TODO: Manually create express server

	// TODO: Use cluster to create multiple instances

	// Create express server
	const app = rc.createExpressServer({
		controllers: [ `${__dirname}/Controllers/*.js` ],
		routePrefix: "/api",

		// TODO: ...
		authorizationChecker: null,
	});

	// Global middleware
	app.use(mongoSanitize());

	// Start listening on port
	app.listen(config.port);

	console.log(`Server is running on port ${config.port}`);
}

// Execute entrypoint
main();