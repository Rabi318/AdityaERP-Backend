import { config } from "dotenv";
config();
import { connect } from "mongoose";
const configs = {
  PORT: process.env.PORT,
  API_VERSION: `api/v1`,
  HOST: `${process.env.HOST}`,
  JWT_SECRET: `${process.env.JWT_SECRET}`,
};

const dbConnect = () => {
  try {
    connect(`${process.env.DB_URL}`);
    console.log("Database connected 🚀🚀🚀");
  } catch (error) {
    console.log(error);
  }
};

export { configs, dbConnect };
