const jwt = require('jsonwebtoken')
const Response = require('../utils/Response')
const User = require('../models/user')
const APIError = require('../utils/Error')

const createToken = async (user,res) => {
    const payload = {
        id : user._id,
        email : user.email,
    }
    const token = await jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn:'7d', algorithm:"HS512"})
    
    if (token) {
        const response = {
            user, token
        }
        return new Response(response, "Token Oluşturuldu, Giriş Başarılı").created(res)
    }
    else throw new APIError("Token oluşturulamadı", 500)
} 

const checkToken = async (req,res,next) => {
    const bearerToken = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    if(! bearerToken) {
        return new Response(null, 'Token bulunamadı oturum açın.').c_401(res)
    } 
    else {
        const token = req.headers.authorization.split(' ')[1]
        await jwt.verify(token, process.env.JWT_SECRET, async (err,decoded) => {
            if(err) {
                throw new APIError("Token çözümlenemedi", 401)
            }
            else {
                const userInfo = await User.findOne({_id : decoded.payload.id})
                if(!userInfo) {
                    throw new APIError("Kullancı veri tabanınında bulunamadı", 500)
                }
                else{
                    req.user = userInfo         //ikisi de olur
                    //res.locals.user = userInfo;
                    next()
                }
            }
        })
    }
}

const createTemporaryToken = async (user,res) => {
    const payload = {
        id : user._id,
        email : user.email
    }
    const temporaryToken = await jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn:'3m', algorithm:"HS512"})
    
    if (temporaryToken) {
        
        return "Bearer " + temporaryToken
    }
    else throw new APIError("Token oluşturulamadı", 500)
}

const decodedTemporaryToken = async (temporaryToken) => {
    const token = temporaryToken.split(" ")[1]
    let user

    await jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
        if (err) throw new APIError('Geçersiz token', 401)

        user = User.findById(decoded.payload.id)
        if(!user) throw new APIError('Geçersiz token', 401)
    })

    return user

}


module.exports = {
    createToken,checkToken,createTemporaryToken,decodedTemporaryToken
}
