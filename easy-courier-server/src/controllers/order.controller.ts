import { Request, Response } from "express";
import Order from "../models/Order";
import { User } from "../models/User";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sender, ...rest } = req.body;
    const senderUser = await User.findById(sender);
    if (!senderUser) {
       res.status(404).json({ error: "Sender not found" });
       return;
    }

    const order = await Order.create({
      sender,
      senderName: senderUser.name,  
      ...rest,
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


// Get all
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { search = "", status } = req.query;
    const query: any = {};

    if (search) {
      const searchRegex = new RegExp(search as string, "i"); 

      query.$or = [
        { fromAddress: searchRegex },
        { toAddress: searchRegex },
        { senderName: searchRegex },
      ];
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("sender")
      .populate("deliveryMan");

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



// Get one
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("sender")
      .populate("deliveryMan");
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get by logged-in email
export const getOrdersByEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
       res.status(401).json({ message: "Unauthorized. Email missing." });
       return;
    }

    const orders = await Order.find()
      .populate({
        path: "sender",
        match: { email: userEmail },
      })
      .populate("deliveryMan");

    const filteredOrders = orders.filter((order) => order.sender !== null);
    res.json(filteredOrders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
