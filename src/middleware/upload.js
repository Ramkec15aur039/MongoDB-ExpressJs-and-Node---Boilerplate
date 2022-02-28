const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(path.join(`${__dirname}`, '../uploads'))) {
      fs.mkdir(path.join(`${__dirname}`, '../uploads'), (err) => {
        if (err) {
          console.log(err.stack);
        } else {
          cb(null, path.join(`${__dirname}`, '../uploads'));
        }
      });
    } else {
      cb(null, path.join(`${__dirname}`, '../uploads'));
    }
    // console.log(file, 'from multer');
    // cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `Image-${Date.now()}`);
  },
});
const upload = multer({
  storage,
  // fileFilter: (req, file, cb) => {
  //   console.log(file, "from multer");
  //   if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  //   }
  // },
});

module.exports = upload;
