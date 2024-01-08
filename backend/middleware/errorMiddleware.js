const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}


const errorHandler = (err, req, res, next) => {
    // safeguard to prevent sending a successful status code when an error has actually occurred
    // that makes sure catches database connectivity issue
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? 'Error' : err.stack,
    })
}

export {notFound, errorHandler}