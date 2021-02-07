const express = require('express');
const serverless = require('serverless-http');
const logger = require('../middleware/log-request');
const uploadDir = require('../middleware/upload-dir');
const convertToBuffer = require('../util/buffer');
const createFile = require('../util/file');

const staticDir = process.env.STATIC_DIR;

if (!staticDir) throw new Error('Directory for static resources not provided');

const app = express();
app.use(logger);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('dist'));

const router = express.Router();

router.post('/', uploadDir, async (req, res) => {
    const { file, name, mimeType, size } = req.body;
    const { buffer } = convertToBuffer(file);

    try {
        const filename = await createFile(buffer, { name, mimeType, size });
        res.send({ filename });
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send({ error: 'Unable to upload file' });
    }
});

app.use('/.netlify/functions/upload', router);

module.exports.handler = serverless(app);

