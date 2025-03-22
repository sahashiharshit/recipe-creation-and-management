import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";
export class User extends Model {
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
      notEmpty:true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "https://recipeimagestore.s3.ap-south-1.amazonaws.com/profile-images/default-avatar.png",
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "superadmin"),
      defaultValue: "user",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    indexes:[
    {unique:true,
      fields:["username"],
    },{
    unique:true,
    fields:["email"],
    },
    ],
  }
);
User.beforeCreate(async (user) => {
  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);
});
User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
});
// Normalize phone number format before creating
User.beforeCreate((user) => {
  if (user.email) {
    user.email = user.email.trim().toLowerCase(); // Remove extra spaces and convert to lowercase
  }
});
