// https://www.npmjs.com/package/multer
import multer from 'multer'

const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']

// kiem tra file nao duco chap nhan 
const fileFilter = (req, file, callback) => {
  // console.log('upload middleware',file)
  // ben FE mimetype la type
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid!'
    return callback(errMessage, null)
  }
  return callback(null, true) // 2 tham so la err , susscess
}

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: fileFilter
})

export const UploadMiddleware = {
  upload
}