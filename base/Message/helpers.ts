export {};
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: `${process.env.cloudinaryName}`,
  api_key: `${process.env.cloudinaryApiKey}`,
  api_secret: `${process.env.cloudinarySecretKey}`,
  secure: true,
});

const uploadFromBuffer = (stream: any, filename: string, type: string): Promise<string> => {
  const uploadDir = path.join(__dirname, "../photos");
  const mediaPath = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) => {
    stream
      .on("error", (error: any) => {
        if (stream.truncated) fs.unlinkSync(mediaPath);
        reject(error);
      })
      .pipe(fs.createWriteStream(mediaPath))
      .on("error", (error: any) => reject(error))
      .on("finish", async () => {
        const res = await cloudinary.uploader.upload(mediaPath, { folder: type === "profile" ? "profile" : "audio" });
        if (res) {
          fs.unlinkSync(mediaPath);
        }
        resolve(res.url);
      });
  });
};

const uploadImageCloudinary = async (stream: any, filename: string, type: string): Promise<string> => {
  const result = await uploadFromBuffer(stream, filename, type);
  return result;
};

export { uploadImageCloudinary };
