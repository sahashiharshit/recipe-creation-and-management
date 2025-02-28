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
   origin:["http://localhost:5173","http://recipesappbucket.s3-website.ap-south-1.amazonaws.com"],
    credentials:true,
    methods: ["GET", "POST","PUT","DELETE"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);
server.listen(3000, () => {
  console.log(`Server Running at port:`, 3000);
});
