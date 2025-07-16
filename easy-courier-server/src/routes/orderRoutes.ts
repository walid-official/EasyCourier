import express from "express"
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getOrdersByEmail,
  updateOrder,
  assignOrder, // ✅ new import
} from "../controllers/order.controller"

import { protect } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/", createOrder)
router.post("/assign", protect, assignOrder) 
router.get("/", getOrders)
router.get("/by-email", protect, getOrdersByEmail)
router.get("/:id", getOrderById)
router.put("/:id", updateOrder)
router.delete("/:id", deleteOrder)


export default router
