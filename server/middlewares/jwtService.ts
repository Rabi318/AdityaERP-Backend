import Jwt from "jsonwebtoken";
import "dotenv/config";
const generateToken = async (id: string) => {
  const accessToken = process.env.JWT_SECRET as string;
  return Jwt.sign({ id }, accessToken, { expiresIn: "1d" });
};

export default generateToken;
