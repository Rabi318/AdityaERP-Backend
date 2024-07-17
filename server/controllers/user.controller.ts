import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { RequestHandler } from "express";
import { GenerateToken } from "../middlewares";
import { Users } from "../models";
export const userController: {
  create: RequestHandler;
  getAllUsers: RequestHandler;
} = {
  async create(req, res, next) {
    try {
      const { phone } = req.body;
      const findUser = await Users.findOne({ phone: phone });
      if (findUser) {
        return res.status(400).json({
          success: false,
          msg: "Phone Number Already Registered",
        });
      }
      const data = await Users.create(req.body);
      if (!data) {
        return res.status(500).json({
          success: false,
          msg: "Internal Server Error While Signup",
        });
      }
      res.json({
        success: true,
        msg: "Registration successfully",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  async getAllUsers(req, res, next) {
    try {
      const pageNumber = req.query.pageNumber
        ? Number(req.query.pageNumber)
        : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const search = req.query.search ? String(req.query.search) : null;
      const village = req.query.village ? String(req.query.village) : null;
      const phone = req.query.phone ? Number(req.query.phone) : null;
      const name = req.query.name ? String(req.query.name) : null;
      const sortBy = req.query.sortBy === "desc" ? -1 : 1;
      const matchPipeline: any[] = [];
      const dataPipeline: any[] = [];
      if (search) {
        matchPipeline.push({
          $match: { name: { $regex: search, $options: "i" } },
        });
      }
      if (village) {
        matchPipeline.push({ $match: { village: village } });
      }
      if (name) {
        matchPipeline.push({ $match: { name: name } });
      }
      if (phone) {
        matchPipeline.push({ $match: { phone: phone } });
      }
      dataPipeline.push(...matchPipeline);
      // Count total documents
      const countPipeline = [...matchPipeline, { $count: "totalCount" }];
      const totalCountData = await Users.aggregate(countPipeline);
      const totalCount =
        totalCountData.length > 0 ? totalCountData[0].totalCount : 0;
      // Pagination and sorting
      dataPipeline.push({ $sort: { name: sortBy } });
      dataPipeline.push({ $skip: (pageNumber - 1) * limit });
      dataPipeline.push({ $limit: limit }); // Projecting fields
      dataPipeline.push({
        $project: {
          _id: 1,
          name: 1,
          village: 1,
          phone: 1,
          email: 1,
          gender: 1,
        },
      });
      const data = await Users.aggregate(dataPipeline);
      res.json({
        success: true,
        msg: "User Get Successfully",
        data: data,
        pagination: {
          totalCount: totalCount,
          page: pageNumber,
          limit: limit,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
