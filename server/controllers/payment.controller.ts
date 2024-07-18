import "dotenv/config";
import { RequestHandler } from "express";
import { Payments } from "../models";

export const paymentController: {
  create: RequestHandler;
} = {
  async create(req, res, next) {
    try {
      const { amount, userId, paymentMode, paymentType } = req.body;
      if (!amount || !userId || !paymentMode || !paymentType) {
        return res.status(400).json({
          success: false,
          msg: "All fields are requireds",
        });
      }
      const data = await Payments.create({
        amount,
        paymentMode,
        paymentType,
        userId,
      });

      if (!data) {
        return res.status(500).json({
          success: false,
          msg: "Something went wrong while creating payment",
        });
      }
      res.json({
        success: true,
        msg: "Payment Done",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
