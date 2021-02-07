const fs = require('fs/promises');
const fsConstants = require('fs').constants;

const uploadDir = process.env.UPLOAD_DIR;

if (!uploadDir) throw new Error('Upload directory not provided');

const checkUploadDirAccess = async () => {
    try {
        await fs.access(uploadDir, fsConstants.F_OK);
    }
    catch (ex) {
        console.debug(ex);
        await createUploadDir();
    }

    try {
        await fs.access(uploadDir, fsConstants.W_OK);
    }
    catch (ex) {
        console.debug(ex);
        throw new Error('Unable to write to upload directory');
    }

    try {
        await fs.access(uploadDir, fsConstants.R_OK);
    }
    catch (ex) {
        console.debug(ex);
        throw new Error('Cannot read from upload directory');
    }
};

const createUploadDir = async () => {
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    }
    catch (ex) {
        console.error(ex);
        throw new Error('Unable to create upload directory');
    }
};

module.exports = async (req, res, next) => {
    try {
        await checkUploadDirAccess();
        next();
    } catch (ex) {
        console.debug(ex);
        res.status(500).send('The directory to upload file to is not accessible');
    }
};
