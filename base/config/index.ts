import { Storage } from "@google-cloud/storage";
import path from "path";

const serviceKey = path.join(__dirname, "./keys.json");

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "micro-robust-app",
});

export { storage };
