import {Router} from "express";
import adminRoutes from "./admin.routes.js";
import usersRoutes from "./users.routes.js";
import socialsRoutes from "./socials.routes.js";
import recipeRoutes from "./recipes.routes.js";
import authRoutes from "./auth.routes.js";
import collectionRoutes from "./collection.routes.js";
import favoriteRoutes from "./favorites.routes.js";
import reviewRoutes from "./review.routes.js";

const routes =Router();

routes.use('/admin',adminRoutes);
routes.use('/auth',authRoutes);
routes.use('/users',usersRoutes);
routes.use('/socials',socialsRoutes);
routes.use('/recipes',recipeRoutes);
routes.use('/collections',collectionRoutes);
routes.use('/favorites',favoriteRoutes);
routes.use('/review',reviewRoutes);

export default routes;