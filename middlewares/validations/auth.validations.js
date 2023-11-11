const joi = require('joi');
const APIError = require('../../utils/Error')

const register = async (req,res,next) => {
    try {
        const schema = await joi.object({
            name : joi.string().trim().min(3).max(50).required().messages({
                "string.base" : "İsim sadece metin içermelidir.",
                "string.empty" : "İsim alanı boş bıraklılmaz.",
                "string.min" : "Minimum 3 harfli isim girmelisiniz.",
                "string.max" : "Maximum 50 harfli isim girmelisiniz.",
                "string.required" : "İsim alanı zorunludur."
            }),
            lastname : joi.string().trim().min(3).max(50).required().messages({
                "string.base" : "Soyad sadece metin içermelidir.",
                "string.empty" : "Soyad alanı boş bıraklılmaz.",
                "string.min" : "Minimum 3 harfli Soyad girmelisiniz.",
                "string.max" : "Maximum 50 harfli Soyad girmelisiniz.",
                "string.required" : "Soyad alanı zorunludur."

            }),
            email : joi.string().email().trim().min(3).max(50).required().messages({
                "string.base" : "Geçerli bir email giriniz",
                "string.empty" : "E-mail alanı boş bıraklılmaz.",
                "string.email" : "Geçerli bir email giriniz. Örnek : ahmetkasap@gmail.com",
                "string.min" : "Minimum 3 harfli E-mail girmelisiniz.",
                "string.max" : "Maximum 50 harfli E-mail girmelisiniz.",
                "string.required" : "E-mail alanı zorunludur."

            }),
            password : joi.string().trim().min(6).max(50).required().messages({
                "string.base" : "Password",
                "string.empty" : "Password alanı boş bıraklılmaz.",
                "string.min" : "Minimum 6 harfli Password girmelisiniz.",
                "string.max" : "Maximum 50 harfli Password girmelisiniz.",
                "string.required" : "Password alanı zorunludur."

            })
        })
        await schema.validateAsync(req.body)
       
        next()
        
        
    } 
    catch (error) {
        //console.log(error) //örneğin 2 harfli isim girilirse hataya yani buraya düşecek.
        const errorMessage = error.details[0].message
        //console.log(errorMessage)

        throw new APIError(errorMessage,400)

    }
   
    
}

const login = async (req,res,next) => {
    try {
        const schema = await joi.object({
            email : joi.string().email().trim().min(3).max(50).required().messages({
                "string.base" : "Geçerli bir email giriniz",
                "string.empty" : "E-mail alanı boş bıraklılmaz.",
                "string.email" : "Geçerli email giriniz. örneğin : aahmetkasap@gmail.com",
                "string.min" : "Minimum 3 harfli E-mail girmelisiniz.",
                "string.max" : "Maximum 50 harfli E-mail girmelisiniz.",
                "string.required" : "E-mail alanı zorunludur."

            }),
            password : joi.string().trim().min(6).max(50).required().messages({
                "string.base" : "Password",
                "string.empty" : "Password alanı boş bıraklılmaz.",
                "string.min" : "Minimum 6 harfli Password girmelisiniz.",
                "string.max" : "Maximum 50 harfli Password girmelisiniz.",
                "string.required" : "Password alanı zorunludur."

            })
        })
        await schema.validateAsync(req.body)
        
        next()
       
       
        
        
    } 
    catch (error) {
        //console.log(error) //örneğin 2 harfli isim girilirse hataya yani buraya düşecek.
        const errorMessage = error.details[0].message
        //console.log(errorMessage)


        throw new APIError(errorMessage,400)



    }
   
   

}

module.exports = {
    login,register
}