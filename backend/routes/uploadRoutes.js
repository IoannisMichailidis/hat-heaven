import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

// Where the images will be stored (in the disk on server side)
const storage = multer.diskStorage({
    destination(req, file, cb) {   // cb: callback
        cb(null, 'uploads/')       // null is for error | uploads/ is where we want the image to be stored. That's in the root
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // how to name the files = img-timestamp-fileExtension
    }
});

// Validate the type of the file
function fileFilter(req, file, cb) {
    const filetypes = /jpe?g|png|webp/;  // reg expression of allowed file types
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'), false);
    }
}

// Upload files
const upload = multer({
    storage,
    fileFilter
});

const uploadSingleImage = upload.single('image'); // only single image

// Route
router.post('/', (req, res) => {
    uploadSingleImage(req, res, function (err){
        if (err) {
            res.status(400).send({message: err.message});
        }
        res.status(200).send({
            message: 'Image Uploaded successfully',
            image:`/${req.file.path}`
        });
    });
});

export default router;