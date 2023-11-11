const APIError = require('../utils/Error')

const errorHandler = (err,req,res,next) => {
    if(err instanceof APIError) {
        return res.status(err.statusCode || 400).json({
            success : false,
            message : err.message
        })
    }

    console.log(err)

    return res.status(500).json({
        success : false,
        message : err.message,  
        
    })
}

module.exports = errorHandler