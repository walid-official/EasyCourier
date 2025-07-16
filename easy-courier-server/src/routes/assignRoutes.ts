import express from "express"
import { protect } from "../middlewares/authMiddleware"
import { assignDelivery, getAssignments } from "../controllers/assign.controller"

const router = express.Router()

router.post("/", protect, assignDelivery)
router.get("/", getAssignments)

export default router

