export {};
import util from "util";
import fs from "fs";
import { v4 } from "uuid";
import path from "path";
import { storage } from "../config";

const bucket = storage.bucket("ichat-app");

/**
 *
 *
 */

const uploadMedia = async (stream: any, filename: string, type: string) => {
  //Upload file temporary to photo folder in directory.
  const uploadDir = "../chat-app/base/photos";

  //Get media path to upload from
  const mediaPath = `${uploadDir}/${filename}`;

  //Structure file name with alignment to folder in cloud storage bucket
  const blob = bucket.file(
    type === "profile"
      ? "profile/" + v4() + path.extname(filename)
      : "audio/" + v4() + path.extname(filename)
  );

  return new Promise((resolve, reject) =>
    stream
      .on("error", (error: any) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(mediaPath);
        reject(error);
      })
      .pipe(fs.createWriteStream(mediaPath))
      .on("error", (error: any) => reject(error))
      .on("finish", async () => {
        const res = await bucket.upload(mediaPath, {
          destination: blob.name,
        });

        if (res) {
          fs.unlinkSync(mediaPath);
        }
        const url = util.format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(url);
      })
  );
};

export { uploadMedia };
