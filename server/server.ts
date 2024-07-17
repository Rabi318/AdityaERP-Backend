import express from "express";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import { ListenerPlugin, RouterPlugin } from "./plugins";
import bodyParser from "body-parser";
const app = express();

app
  .use(morgan("dev"))
  .use(cors())
  .options("*", cors())
  .use(express.json({ limit: "50mb" }))
  .use(express.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(fileUpload());

RouterPlugin.setup(app);
ListenerPlugin.listen(app);
