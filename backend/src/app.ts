import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

export const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("api", routes);
app.use(errorMiddleware);
