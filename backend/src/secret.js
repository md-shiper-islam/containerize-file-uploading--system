require("dotenv").config();

const PORT = process.env.PORT || 3000;

const Db_URI = process.env.MongoDB_URI;

const JWT_SECRET_Key = process.env.JWT_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const REDIS_URL = process.env.REDIS_URL; 

console.log('SECRET.JS - Loaded API Key:', CLOUDINARY_API_KEY);
module.exports = {
    PORT,
    Db_URI,
    JWT_SECRET_Key,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    REDIS_URL
};