import "dotenv/config";
import { RequestHandler } from "express";
import { Paddies } from "../models";
import mongoose from "mongoose";
export const paddiesController: {
  create: RequestHandler;
  getByUserId: RequestHandler;
} = {
  async create(req: any, res, next) {
    try {
      const data = await Paddies.create({
        ...req.body,
      });
      if (!data) {
        return res.status(500).json({
          success: false,
          msg: "Something went wrong on server!!",
        });
      }
      res.json({
        success: true,
        msg: "Create successfully",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  async getByUserId(req, res, next) {
    try {
      const userId = req.params.id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          msg: "User id required!!",
        });
      }
      const data = await Paddies.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $addFields: {
            totalQnt: { $sum: "$packet" },
            perKg: { $divide: ["$rate", 100] },
            nonPlasticD: { $multiply: ["$nonPlastic", "$nonPlasticRate"] },
          },
        },
        {
          $lookup: {
            from: "PaddyTypes",
            foreignField: "_id",
            localField: "paddyType",
            as: "paddyType",
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: "$paddyType",
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            totalQnt: 1,
            date: 1,
            rate: 1,
            nonPlastic: 1,
            packet: 1,
            paddyType: 1,
            nonPlasticRate: 1,
            nonPlasticD: 1,
            totalAmount: { $multiply: ["$totalQnt", "$perKg"] },
            toPaid: {
              $subtract: [
                { $multiply: ["$totalQnt", "$perKg"] },
                "$nonPlasticD",
              ],
            },
          },
        },
      ]);
      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          msg: "No data found for the provided user id",
        });
      }
      if (!data) {
        return res.status(500).json({
          success: false,
          msg: "Something wrong on server",
        });
      }
      res.json({
        success: true,
        msg: "Successfully get data",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
