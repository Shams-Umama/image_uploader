const express = require("express");
const multer = require("multer");
const {
    uploadImage,
    getHistory,
    deleteHistory
} = require("../controllers/uploadController");
const router = express.Router();

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({ storage: storage });

router.post(
    "/upload",
    upload.single("image"),
    uploadImage
);

router.get("/history", getHistory);
router.delete("/delete/:id", deleteHistory);

module.exports = router;