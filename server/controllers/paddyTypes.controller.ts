import "dotenv/config";
import { RequestHandler } from "express";
import { PaddyTypes } from "../models";

export const paddyTypesController: {
  create: RequestHandler;
  getAll: RequestHandler;
  delete: RequestHandler;
} = {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({
          success: false,
          msg: "Name is required!!",
        });
      }
      const data = await PaddyTypes.create({
        name,
      });
      if (!data) {
        return res.status(500).json({
          success: false,
          msg: "Something went wrong while creating!!",
        });
      }
      res.json({
        success: true,
        msg: "Successfully Paddy types created",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const data = await PaddyTypes.aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
      if (!data) {
        return res.status(500).json({
          success: false,
          msg: "Something went wrong while getting data!",
        });
      }
      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const data = await PaddyTypes.findByIdAndDelete(id);
      if (!data) {
        return res.status(500).json({
          success: false,
          msg: "Something went wrong while delete the data!",
        });
      }
      res.json({
        success: true,
        msg: "Paddy Type Deleted Successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
