
import {User}  from "../models/User.js";
import {Favorite} from "../models/Favorite.js";
import {Follow} from "../models/Follow.js";
import {Recipe} from "../models/Recipe.js";
import {Review} from "../models/Review.js";

import {Admin} from "../models/Admin.js";
import { Categories } from "../models/Categories.js";


User.hasMany(Recipe, { foreignKey: 'userId' });
User.hasMany(Favorite, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });

User.belongsToMany(User, { as: 'Followers', through: Follow, foreignKey: 'followingId' });
User.belongsToMany(User, { as: 'Following', through: Follow, foreignKey: 'followerId' });



Recipe.belongsTo(User, { foreignKey: 'userId' });
Recipe.hasMany(Favorite, { foreignKey: 'recipeId' });
Recipe.hasMany(Review, { foreignKey: 'recipeId' });

// ✅ One Category has many Recipes
Categories.hasMany(Recipe, { foreignKey: 'categoryId', as: 'recipes' });

// ✅ One Recipe belongs to one Category
Recipe.belongsTo(Categories, { foreignKey: 'categoryId', as: 'category' });

Favorite.belongsTo(User, { foreignKey: 'userId' });
Favorite.belongsTo(Recipe, { foreignKey: 'recipeId' });

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Recipe, { foreignKey: 'recipeId' });

Follow.belongsTo(User, { foreignKey: 'followerId', as: 'Follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'Following' });



export {User,Favorite,Follow,Recipe,Review,Admin,Categories};