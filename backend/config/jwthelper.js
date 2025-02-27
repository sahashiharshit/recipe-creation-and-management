import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET;
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const generateTokenForAdmin = (admin)=>{
  return jwt.sign(
  
  {id:admin.id,role:"admin"},
  JWT_SECRET,
  {expiresIn:"15m"}
  );

};

export const generateRefreshToken = (admin)=>{
return jwt.sign({ id: admin.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

};