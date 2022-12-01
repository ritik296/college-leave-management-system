const express = require('express');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/image', upload.single('upload'), async (req, res) => {
    try {
        res.status(200).json({uploaded: "Imaage uploaded", url: `${req.file.path}`});
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});

module.exports = router;