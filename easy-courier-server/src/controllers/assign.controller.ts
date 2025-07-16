import { AuthRequest } from "../middlewares/authMiddleware";
import { Assignment } from "../models/Assignment";
import Order from "../models/Order";
import { Response } from "express";

export const assignDelivery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, deliveryManId, note } = req.body;
    const assignedBy = req.user?.id;

    if (!assignedBy) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Check if already assigned
    const existing = await Assignment.findOne({ orderId });
    if (existing) {
      res.status(400).json({ message: "This order is already assigned." });
      return;
    }

    const assignment = new Assignment({
      orderId,
      deliveryManId,
      assignedBy,
      note,
    });

    await assignment.save();

    // Update order
    await Order.findByIdAndUpdate(orderId, {
      status: "Assigned",
      deliveryMan: deliveryManId,
    });

    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assignments = await Assignment.find()
      .populate("orderId")
      .populate("deliveryManId", "name email") 
      .populate("assignedBy", "name email") 

    res.status(200).json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};