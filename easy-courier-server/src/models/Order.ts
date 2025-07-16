import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  sender: mongoose.Types.ObjectId;
  deliveryMan?: mongoose.Types.ObjectId | null;
  fromAddress: string;
  toAddress: string;
  parcelType: "Document" | "Package" | "Fragile" | "Other";
  weight: string;
  price: number;
  status: "Pending" | "Picked" | "Delivered";
  senderName: string
}

const orderSchema = new Schema<IOrder>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {             
      type: String,
      required: true,
      index: true,
    },
    deliveryMan: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fromAddress: {
      type: String,
      required: true,
    },
    toAddress: {
      type: String,
      required: true,
    },
    parcelType: {
      type: String,
      enum: ["Document", "Package", "Fragile", "Other"],
      default: "Package",
    },
    weight: {
      type: String,
      default: "Standard",
    },
    price: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: ["Pending", "Picked", "Assigned", "Delivered"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;