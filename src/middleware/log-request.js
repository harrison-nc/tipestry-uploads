module.exports = (req, res, next) => {
    console.log('content-type: ', req.headers['content-type']);
    next();
};
