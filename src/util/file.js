const path = require('path');
const fs = require('fs').promises;

const uploadDir = process.env.UPLOAD_DIR;

if (!uploadDir) throw new Error('Upload directory not provided');

module.exports = async (buffer, { name }) => {
    const ext = path.extname(name);
    const encodedFilename = Buffer.from(name).toString('base64');
    const filename = `${uploadDir}/${encodedFilename}${Date.now()}${ext}`;

    try {
        await fs.writeFile(filename, buffer);
        return filename;
    }
    catch (ex) {
        console.debug(ex);
        throw new Error('Could not upload file');
    }
};
