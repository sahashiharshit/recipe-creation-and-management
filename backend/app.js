import express from "express";
import http from "http";
import cors from "cors";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
import adminRoutes from "./routes/admin.routes.js";
import cookieParser from 'cookie-parser';
const app = express();
const server = http.createServer(app);



app.use(
  cors({
   origin:["https://recipesapp.duckdns.org","https://admin-recipesapp.duckdns.org","http://localhost:5050","http://localhost:5173"],
    credentials:true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Authorization, Content-Type",
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);

app.use("/admin",adminRoutes);

server.listen(5000, () => {
  console.log(`Server Running at port:`, 5000);
});
