import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
const allowedOrigins = [
/*  "https://x5-aside.vercel.app",
"https://661a859e-215d-4ee7-ad03-221007b9ef75-00-yr7tnm5anqkz.picard.replit.dev",*/
"http://localhost:5173"
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

app.get("/", (req, res) => {
  res.send("API is running!");
});
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

import userRoutes from "./routes/userRoutes.js";
import fixtureRoutes from './routes/fixtureRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import matchdayRoutes from './routes/matchdayRoutes.js'

app.use("/api/users", userRoutes);
app.use("/api/fixtures", fixtureRoutes);
app.use("/api/teams", teamRoutes);
app.use('/api/matchdays', matchdayRoutes)

app.use(errorHandler)
const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
