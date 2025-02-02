import express from "express";
import http from "http";
import cors from "cors";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://127.0.0.1:3000", "http://localhost:3000"];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  })
);

app.use("/recipe-management", routes);
server.listen(3000, () => {
  console.log(`Server Running at port:`, 3000);
});
