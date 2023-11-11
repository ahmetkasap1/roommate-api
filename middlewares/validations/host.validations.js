const joi = require('joi');
const APIError = require('../../utils/Error')

const hostValidations = async (req,res,next) => {
    try {
        const schema = await joi.object({
            location : joi.string().min(1).max(100).required().messages({
                "string.base": "Konum bir metin olmalıdır.",
                "string.empty": "Konum boş bırakılamaz.",
                "string.min": "Minimum 1 karakterlik konum girmelisiniz.",
                "string.max": "Maximum 100 karakterlik konum girmelisiniz.",
                "any.required" : "konum boş bırakılmaz"
            }),
            hostType : joi.string().trim().min(1).max(50).required().messages({
                "string.base": "mekan bir metin olmalıdır.",
                "string.empty": "mekan boş bırakılamaz.",
                "string.min": "Minimum 1 karakterlik mekan girmelisiniz.",
                "string.max": "Maximum 50 karakterlik mekan girmelisiniz.",
                "any.required" : "mekan boş bırakılmaz"

            }),
            numberOfGuests : joi.number().required().messages({
                "string.empty": "kişi sayısı boş bırakılamaz.",
                "string.required" : "konaklayacak kişi sayısı zorunludur"

            }),
            price : joi.number().required().messages({
                "string.empty": "fiyat boş bırakılamaz.",
                "string.required" : "fiyat belirlemek zorunludur"

            }),
            explanation : joi.string().min(5).max(500).messages({
                "string.min" : "Minimum 5 karekter girmelisiniz.",
                "string.max" : "Maximum 500 karekter girmelisiniz.",
            })
           

        })
        await schema.validateAsync(JSON.parse(req.body.data))
       
        next()
        
        
    } 
    catch (error) {
        console.log(error) //örneğin 2 harfli isim girilirse hataya yani buraya düşecek.
        const errorMessage = error.details[0].message
        console.log(errorMessage)

        throw new APIError(errorMessage,400)

    }
   
    
}



module.exports = hostValidations