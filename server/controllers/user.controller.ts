import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { RequestHandler } from "express";
import { GenerateToken } from "../middlewares";
import { Users, OTP } from "../models";
import { EmailServices } from "../services";
export const userController: {
  create: RequestHandler;
  getAllUsers: RequestHandler;
  login: RequestHandler;
  getUserById: RequestHandler;
  addEmailSendOptforPasswordset: RequestHandler;
  verifyOtpAndSetPassword: RequestHandler;
} = {
  async create(req, res, next) {
    try {
      const { phone, email, password, gender, village, name } = req.body;
      const findUser = await Users.findOne({ phone: phone });
      if (findUser) {
        return res.status(400).json({
          success: false,
          msg: "Phone Number Already Registered",
        });
      }
      const userData: {
        phone: number;
        email?: string | null;
        password?: string | null;
        name: string;
        village: string;
        gender: string;
      } = {
        phone: phone,
        email: email || null,
        password: null,
        name: name,
        village: village,
        gender: gender,
      };
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password = hashedPassword;
      }
      const data = await Users.create(userData);
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
  async login(req, res, next) {
    try {
      const { phone, password } = req.body;
      const findUser = await Users.findOne({ phone: phone });
      if (!findUser) {
        return res.status(404).json({
          success: false,
          msg: "Invalid phone number!!",
        });
      }
      if (findUser.email === null) {
        return res.status(400).json({
          success: false,
          msg: "Please add your email before login!!",
        });
      }
      // Check if the user has a password set
      if (!findUser.password) {
        return res.status(400).json({
          success: false,
          msg: "No password set for this user. Please use a different login method.",
        });
      }
      const passwordMatch = await bcrypt.compare(password, findUser?.password);
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          msg: "Incorrect password. Please try again.",
        });
      }
      const token = await GenerateToken(findUser._id.toString());
      if (!token) {
        return res.status(500).json({
          success: false,
          msg: "Something went wrong while token create!!",
        });
      }
      res.json({
        success: true,
        msg: "Login successfully",
        user: findUser,
        token: token,
      });
    } catch (error) {
      next(error);
    }
  },
  async getUserById(req, res, next) {
    try {
      const userId = req.user?._id;
      // console.log("UserID===========>", userId);
      if (!userId) {
        return res.status(400).json({
          success: false,
          msg: "UserId required!!",
        });
      }
      const findUser = await Users.findById(userId).select("-password");
      if (!findUser) {
        return res.status(404).json({
          success: false,
          msg: "User not found!!",
        });
      }
      res.json({
        success: true,
        msg: "Successful",
        data: findUser,
      });
    } catch (error) {
      next(error);
    }
  },
  async addEmailSendOptforPasswordset(req, res, next) {
    try {
      const { email, phone } = req.body;
      const findUser = await Users.findOne({ phone: phone });
      if (!findUser) {
        return res.status(404).json({
          success: false,
          msg: "User not found with the phoen number!!",
        });
      }
      const otp = Math.floor(Math.random() * 999999);
      let expireTime = new Date();
      expireTime.setMinutes(expireTime.getMinutes() + 3);
      const data = await OTP.findOneAndUpdate(
        { phone: phone },
        {
          otp: otp,
          expireAt: expireTime,
          email: email,
          userId: findUser._id,
        },
        {
          upsert: true,
          new: true,
        }
      );
      if (!data) {
        return res.status(500).json({
          success: false,
          msg: "Something went wrong while set otp at model",
        });
      }
      const sendMail = await EmailServices.setPasswordEmail(
        email,
        findUser.name,
        otp
      );
      if (!sendMail) {
        return res.status(500).json({
          success: false,
          msg: "Something went wrong on server while sending email",
        });
      }
      const setEmailForUser = await Users.findOneAndUpdate(
        { phone: phone },
        {
          email: email,
        },
        { upsert: true, new: true }
      );
      if (!setEmailForUser) {
        return res.status(500).json({
          success: false,
          msg: "Email not set for the user",
        });
      }
      res.json({
        success: true,
        msg: "Otp Send Successfully",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  async verifyOtpAndSetPassword(req, res, next) {
    try {
      const { otp, password } = req.body;
      const findOtp = await OTP.findOne({
        otp: otp,
        expireAt: { $gte: new Date() },
      });
      if (!findOtp) {
        return res.status(400).json({
          success: false,
          msg: "OTP Expired",
        });
      }
      if (otp !== findOtp.otp) {
        return res.status(400).json({
          success: false,
          msg: "Invalid OTP",
        });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const data = await Users.findByIdAndUpdate(
        findOtp.userId,
        { password: hashPassword },
        { new: true }
      );
      if (!data) {
        return res.status(500).json({
          success: false,
          msg: "Something went wrong while set password",
        });
      }
      res.json({
        success: true,
        msg: "Password Set Successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
