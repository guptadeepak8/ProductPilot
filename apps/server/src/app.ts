import express, { type Express } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
const app:Express  = express();
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", routes);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);
export default app;