import express from "express";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../controllers/transaction.controllers.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").get(getTransactions).post(protect, addTransaction);

router.route("/:id").delete(protect, deleteTransaction);

export default router;
