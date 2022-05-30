var express = require("express");
var router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const { addImage, getImageById, getImage, removeImage, updateImage, getAllImages, getImageCount } = require("../Controller/Image");
const { isAuthenticated, isSignedIn } = require("../Controller/Auth");
const { getUserById } = require("../Controller/User");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
let upload = multer({ storage, fileFilter });

router.param("userId", getUserById);
router.param("imageId", getImageById);

router.post('/api/v1/Images/:userId', isSignedIn, isAuthenticated, upload.single('data'), addImage);
router.put('/api/v1/Images/:userId/:imageId', isSignedIn, isAuthenticated, upload.single('data'), updateImage);
router.get('/api/v1/Images/:userId/:imageId', isSignedIn, isAuthenticated, getImage);
router.get('/api/v1/Images/:userId', isSignedIn, isAuthenticated, getAllImages);
router.get('/api/v1/ImagesCount/:userId', isSignedIn, isAuthenticated, getImageCount);
router.delete('/api/v1/Images/:userId/:imageId', isSignedIn, isAuthenticated, removeImage);

module.exports = router;