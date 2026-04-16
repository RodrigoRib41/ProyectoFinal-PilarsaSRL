import { v2 as cloudinary } from "cloudinary";
import { env, hasCloudinaryConfig } from "@/lib/core/env";

let configured = false;

export function ensureCloudinary() {
  if (!hasCloudinaryConfig()) {
    return null;
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
    configured = true;
  }

  return cloudinary;
}
