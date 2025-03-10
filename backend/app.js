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
   origin:["https://recipe-management-lovat.vercel.app","http://localhost:5173"],
    credentials:true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Authorization, Content-Type",
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});
server.listen(3000, () => {
  console.log(`Server Running at port:`, 3000);
});
