
// const express = require("express");
// const path = require('path');
// const multer = require("multer")
// const router = express.Router()



// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'public')
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     )
//   },
// })

// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png/
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//   const mimetype = filetypes.test(file.mimetype)
// console.log(extname,mimetype);
//   if (extname && mimetype) {
//     return cb(null, true)
//   } else {
//     cb('Images only!')
//   }
// }
// // const upload = multer({ dest: "public/files" });
// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb)
//   },
// })

// router.post('/upload', upload.single('image'), (req, res) => {
//   console.log(req.body)
//   console.log(req.file, 'file')
//   res.send(`/${req.file.path}`)
// })

// module.exports = router;