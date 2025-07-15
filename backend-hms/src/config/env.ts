import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ .env

export const env = {
  // ========== APP ==========
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "8080", 10),
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:8080",

  // ========== DATABASE ==========
  MONGO_DB_URL: process.env.MONGO_DB_URL!,

  // ========== AUTH ==========
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES: process.env.JWT_EXPIRES || "1d",

  // ========== CLOUDINARY ==========
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    API_KEY: process.env.CLOUDINARY_API_KEY!,
    API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  },

  // ========== GOOGLE OAUTH ==========
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,

  // ========== REDIS ==========
  REDIS: {
    HOST: process.env.REDIS_HOST || "localhost",
    PORT: parseInt(process.env.REDIS_PORT || "6379", 10),
    USERNAME: process.env.REDIS_USERNAME || "default",
    PASSWORD: process.env.REDIS_PASSWORD!,
  },

  // ========== GEMINI ==========
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,

  // ========== VNPAY ==========
  VNPAY: {
    TMN_CODE: process.env.VNP_TMN_CODE!,
    HASH_SECRET: process.env.VNP_HASH_SECRET!,
    RETURN_URL: process.env.VNP_RETURN_URL!,
  },
};
