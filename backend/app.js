import express from "express";
import http from "http";
import cors from "cors";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
import cookieParser from 'cookie-parser';
const app = express();
const server = http.createServer(app);



app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://127.0.0.1:5173", "http://localhost:5173","http://192.168.31.219:5173"];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials:true,
    methods: ["GET", "POST","PUT","DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
server.listen(3000, () => {
  console.log(`Server Running at port:`, 3000);
});
