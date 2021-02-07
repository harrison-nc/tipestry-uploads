const path = require('path');
const multer = require('multer');
const express = require('express');
const serverless = require('serverless-http');
const logger = require('../middleware/log-request');
const checkDirectory = require('../middleware/upload-dir');

const uploadDir = process.env.UPLOAD_DIR;

if (!uploadDir) throw new Error('Upload directory not provided');

const app = express();
app.use(logger);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('dist'));

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function (req, file, cb) {
        const { originalname } = file;

        const ext = path.extname(originalname);

        const encodedFilename = `${originalname}${Date.now()}`;

        const filename = `${encodedFilename}${ext}`;
        req.filename = filename;
        cb(null, filename);
    },
});

const myMulter = multer({ storage });
const uploadFile = myMulter.single('file');

const router = express.Router();

router.post('/', [checkDirectory, uploadFile], async (req, res) => {
    console.log('# request body\n', req.body);

    res.send({ filename: req.filename });
});

app.use('/.netlify/functions/upload', router);

module.exports.handler = serverless(app);

