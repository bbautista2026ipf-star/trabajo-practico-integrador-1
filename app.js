import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/database.js";
import "./src/models/index.js";
import { authRoutes } from "./src/routes/auth.routes.js";
import { userRoutes } from "./src/routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api", authRoutes);
app.use("/api", userRoutes);

await connectDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
