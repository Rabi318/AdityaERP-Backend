import { Document } from "mongoose";

export default interface USER_TYPE {
  name: string;
  phone: number;
  password?: string;
  role: "ADMIN" | "USER";
  gender: "MALE" | "FEMALE";
  village: string;
  email?: string;
}

export default interface PADDY_TYPES {
  userId: object;
  paddyType: object;
  packet: number[];
  nonPlastic: number;
  date: Date;
  rate: number;
  nonPlasticRate: number;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: Document<any, any>; // Adjust based on your User model type
  }
}

export default interface OTP_TYPES {
  email: string;
  phone: number;
  userId: object;
  otp: string;
  expireAt: Date;
}
export default interface PAYMENT_TYPES {
  amount: number;
  paymentType: "ADVANCE" | "PAID";
  paymentMode: "ONLINE" | "CASH";
  userId: object;
}

export default interface PADDYTYPES_TYPES {
  name: string;
}
