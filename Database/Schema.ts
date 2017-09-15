import * as mongoose from "mongoose";

export default class Schema extends mongoose.Schema {
    constructor(schema: mongoose.SchemaDefinition) {
        schema.createdAt = {
            type: Date,
            required: false
        };

        schema.updatedAt = {
            type: Date,
            required: false
        };

        super(schema);

        super.pre("save", function(next) {
            let now = new Date();
            if (!this.createdAt) {
                this.createdAt = now;
            }
            this.updatedAt = now;

            next();
        });
    }
}