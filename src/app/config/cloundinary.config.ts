import { envVars } from './.env';
// frontend -> form data with image file-> multer -> form data->req(body)
import{v2 as cloudinary } from "cloundinary"

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
})