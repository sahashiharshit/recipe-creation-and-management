import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class Recipe extends Model {}

Recipe.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cookingTime: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false,
    },

    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: "categories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Recipe",
    tableName: "recipes",
    timestamps: true,
  }
);
