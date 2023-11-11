const nodemailer = require("nodemailer");
const Response = require('../utils/Response');
const APIError = require("./Error");

const sendMail = async (mailOptions) => {

    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth : {
            user : process.env.EMAIL_ADRESS,
            pass : process.env.EMAIL_PASSWORD
        }
    })
    transporter.sendMail(mailOptions, (error,info) => {
        if(error) throw new APIError('Mail gönderimi sırasında bir hata meydana geldi', 400)
        else return true
        //console.log(info)
    })
   
}


module.exports = sendMail
