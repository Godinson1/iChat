"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageCloudinary = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: `${process.env.cloudinaryName}`,
    api_key: `${process.env.cloudinaryApiKey}`,
    api_secret: `${process.env.cloudinarySecretKey}`,
    secure: true,
});
const uploadFromBuffer = (stream, filename, type) => {
    const uploadDir = path_1.default.join(__dirname, "../photos");
    const mediaPath = `${uploadDir}/${filename}`;
    return new Promise((resolve, reject) => {
        stream
            .on("error", (error) => {
            if (stream.truncated)
                fs_1.default.unlinkSync(mediaPath);
            reject(error);
        })
            .pipe(fs_1.default.createWriteStream(mediaPath))
            .on("error", (error) => reject(error))
            .on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield cloudinary_1.v2.uploader.upload(mediaPath, { folder: type === "profile" ? "profile" : "audio" });
            if (res) {
                fs_1.default.unlinkSync(mediaPath);
            }
            resolve(res.url);
        }));
    });
};
const uploadImageCloudinary = (stream, filename, type) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield uploadFromBuffer(stream, filename, type);
    return result;
});
exports.uploadImageCloudinary = uploadImageCloudinary;
