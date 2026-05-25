import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(),".env") });

const config = {
  port : process.env.PORT,
  database_connection_string : process.env.DATABASE_CONNECTION_STRING,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,

};
export default config;