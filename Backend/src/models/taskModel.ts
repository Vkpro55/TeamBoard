import { Schema, model, Types, type Document } from "mongoose";

export interface ITask extends Document {
    project: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "Todo" | "In Progress" | "Completed";
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
            index: true,
        },

        status: {
            type: String,
            enum: ["Todo", "In Progress", "Completed"],
            default: "Todo",
            index: true,
        },

        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ project: 1, status: 1 });

taskSchema.index({ project: 1, dueDate: 1 });

const Task = model<ITask>("Task", taskSchema);
export default Task;