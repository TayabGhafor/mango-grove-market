import multer from "multer";
import { configureCloudinary } from "../config/cloudinary.js";

export const uploadProductImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter(_req, file, callback) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      callback(new Error("Only JPEG, PNG, and WEBP images are allowed."));
      return;
    }

    callback(null, true);
  },
}).array("images", 5);

const uploadBuffer = (file) => new Promise((resolve, reject) => {
  const cloudinary = configureCloudinary();
  const stream = cloudinary.uploader.upload_stream({
    folder: "mango-grove-market/products",
    resource_type: "image",
    transformation: [
      { width: 1200, height: 1200, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  }, (error, result) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(result);
  });

  stream.end(file.buffer);
});

export const handleProductImageUpload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length < 2 || req.files.length > 5) {
      res.status(400).json({ message: "Upload 2 to 5 product images." });
      return;
    }

    const uploads = await Promise.all(req.files.map(uploadBuffer));
    res.status(201).json({
      images: uploads.map((upload) => ({
        url: upload.secure_url,
        publicId: upload.public_id,
      })),
    });
  } catch (error) {
    next(error);
  }
};
