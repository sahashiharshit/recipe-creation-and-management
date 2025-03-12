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
   origin:["http://recipesapp.duckdns.org"],
    credentials:true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Authorization, Content-Type",
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);

server.listen(5000, () => {
  console.log(`Server Running at port:`, 5000);
});
