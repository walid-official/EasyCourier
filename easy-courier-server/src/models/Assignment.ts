import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  orderId: mongoose.Types.ObjectId;
  deliveryManId: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId; // typically admin
  assignedAt: Date;
  note?: string;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    deliveryManId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
