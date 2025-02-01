import {Router} from "express";
import adminRoutes from "./admin.routes.js";
import userAuthRoutes from "./user-authentication.routes.js";
import socialsRoutes from "./socials.routes.js";
import recipeRoutes from "./recipe-management.routes.js";

const routes =Router();

routes.use('/admin',adminRoutes);
routes.use('/auth',userAuthRoutes);
routes.use('/socials',socialsRoutes);
routes.use('/recipe-management',recipeRoutes);

export default routes;