import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import linkRoutes from "./routes/links.routes.js";
import { redirectLink, healthCheck } from "./controller/links.controller.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/api", linkRoutes);
app.get("/healthz", healthCheck);

app.get("/:code", redirectLink);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT} 🚀`);
});
