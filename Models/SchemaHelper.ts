import * as mongoose from "mongoose";

export default class SchemaHelper {
    public static Create(schema: mongoose.SchemaDefinition): mongoose.Schema {
        schema.createdAt = {
            type: Date,
            required: false
        };

        schema.updatedAt = {
            type: Date,
            required: false
        };

        var mgSchema = new mongoose.Schema(schema);
        mgSchema.pre("save", function(next) {
            let now = new Date();
            if (!this.createdAt) {
                this.createdAt = now;
            }
            this.updatedAt = now;
        
            next();
        });

        return mgSchema;
    }
}