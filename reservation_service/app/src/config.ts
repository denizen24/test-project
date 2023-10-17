export default {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL || "mongodb://localhost:27017/mydb",
  cookieSecret: process.env.COOKIE_SECRET || "COOKIE_SECRET",
  imagesUploadPath: process.env.IMAGES_UPLOAD_PATH || 'public/images',
  maxUploadSize: Number.parseFloat(process.env.MAX_UPLOAD_SIZE) || 10, // in MB
  maxFilesCount: Number.parseInt(process.env.MAX_FILES_COUNT) || 10, // Maximum number of files that can be uploaded at once
}
