const cloudinary = require("cloudinary").v2;

const env = require("../../config/env");
const { InternalServerError } = require("../../core/ErrorResponse");

cloudinary.config({
  cloudinary_url: env.CLOUDINARY_URL,
});

class CloudService {
  /**
   *
   * @param {Express.Multer.File} file
   */
static async uploadImage(file) {
    try {
      const res = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          })
          .end(file.buffer);
      });

      return {
        publicId: res.public_id,
        url: res.secure_url,
        createdAt: res.created_at,
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerError("Failed to upload image to cloud: " + error.message);
    }
  }

  static async deleteImage(publicId) {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok" && result.result !== "not found") {
      throw new InternalServerError("Failed to delete image: " + error.message);
    }
  }
}

module.exports = CloudService;