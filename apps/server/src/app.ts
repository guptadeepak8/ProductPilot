import express, { type Express } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
const app:Express  = express();
app.use(cors());

app.use(express.json());
app.use("/api/v1", routes);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);
export default app;