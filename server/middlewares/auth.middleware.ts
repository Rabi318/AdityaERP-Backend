import { NextFunction, Response } from "express";
import { Unauthorized } from "http-errors";
import Jwt from "jsonwebtoken";
import { Users } from "../models";

interface JwtPayload {
  id: string;
}
export const authenticate = {
  any: async (req: any, _res: Response, next: NextFunction) => {
    try {
      const accessToken = process.env.JWT_SECRET as string;
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new Unauthorized("Authorization header is missing");
      }
      const token = authorizationHeader.split(" ")[1];
      if (!token) throw new Unauthorized("Token is missing");

      const decoded = Jwt.verify(token, accessToken);
      const user = await Users.findById((decoded as JwtPayload)?.id);
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  },
  admin: async (req: any, res: Response, next: NextFunction) => {
    try {
      const accessToken = process.env.JWT_SECRET as string;
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader)
        throw new Unauthorized("Authorization header is missing");
      const token = authorizationHeader.split(" ")[1];
      if (!token) throw new Unauthorized("Token is missing");
      const decoded = Jwt.verify(token, accessToken);
      const user = await Users.findById((decoded as JwtPayload)?.id);
      if (user?.role !== "ADMIN") {
        return res.status(401).json({
          success: false,
          msg: "Not Authorized",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  },
};
