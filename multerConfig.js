const multer = require('multer')
const path = require('path')
const DatauriParser = require('datauri/parser')

const multerUpload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024
    }
}).single('file')

const dataURI = req => new DatauriParser().format(path.extname(req.file.originalname).toString(), req.file.buffer).content

module.exports = { multerUpload, dataURI }