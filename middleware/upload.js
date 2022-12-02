import path from 'path';
import multer from 'multer';

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        // console.log(file);
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

var upload = multer({
    storage: storage,
    // fileFilter: function(req, file, cb){
    //     // console.log(file);
    //     // if(
    //     //     file.mimetype == "image/png" ||
    //     //     file.mimetype == "image/jpeg" ||
    //     //     file.mimetype == "application/pdf" 
    //     // ){
    //         cb(null, true);
    //     // }
    //     // else {
    //     //     cb(null, false);
    //     // }
    // },
    limits: {
        fileSize: 1024*1024*4*1024
    }
});

// module.exports = upload;
export default upload;