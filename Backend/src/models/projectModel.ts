import { Schema, model, Types, type Document } from "mongoose";

export interface IProject extends Document {
    owner: Types.ObjectId;
    name: string;
    description: string;
    status: "Active" | "Archived";
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        status: {
            type: String,
            enum: ["Active", "Archived"],
            default: "Active",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

projectSchema.index({ owner: 1, status: 1 });

const Project = model<IProject>("Project", projectSchema);
export default Project;