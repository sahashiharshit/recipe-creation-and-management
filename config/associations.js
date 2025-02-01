import Admin from "../models/Admin.js";
import Favorite from "../models/Favorite.js";
import Follow from "../models/Follow.js";
import Recipe from "../models/Recipe.js";
import Review from "../models/Review.js";
import User  from "../models/Users.js";


User.hasMany(Recipe, { foreignKey: 'userId' });
User.hasMany(Favorite, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });
User.hasMany(Follow, { foreignKey: 'followerId' });
User.hasMany(Follow, { foreignKey: 'followingId' });
User.hasOne(Admin, { foreignKey: 'userId' });

Recipe.belongsTo(User, { foreignKey: 'userId' });
Recipe.hasMany(Favorite, { foreignKey: 'recipeId' });
Recipe.hasMany(Review, { foreignKey: 'recipeId' });

Favorite.belongsTo(User, { foreignKey: 'userId' });
Favorite.belongsTo(Recipe, { foreignKey: 'recipeId' });

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Recipe, { foreignKey: 'recipeId' });

Follow.belongsTo(User, { foreignKey: 'followerId', as: 'Follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'Following' });

Admin.belongsTo(User, { foreignKey: 'userId' });

export {User,Favorite,Follow,Recipe,Review,Admin};