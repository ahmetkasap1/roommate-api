const User = require('../models/user')
const bcrypt = require('bcrypt')
const APIError = require('../utils/Error')
const Response = require('../utils/Response')
const jwt = require('jsonwebtoken')
const authMiddlewares = require('../middlewares/auth')
const sendMail = require('../utils/sendMail')
const crypto = require('crypto');
const moment = require('moment')
const Host = require('../models/host')

const register = async (req, res) => {
    const checkUser = await User.findOne({ email: req.body.email })

    if (!checkUser) {
        const password = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password
        })
        await user.save()
            .then(savedUser => {
                return new Response(savedUser, 'Kayıt başarıyla oluşturuldu').created(res)
            })
            .catch((err) => {
                throw new APIError('Kayıt sırasında bir hata meydana geldi.', 400)
            })

    }
    else {
        return new Response(null, 'email zaten kullanımda !',).c_400(res)
    }
}

const login = async (req, res) => {

    const user = await User.findOne({ email: req.body.email })

    if (user && await bcrypt.compare(req.body.password, user.password)) {
        authMiddlewares.createToken(user, res) //* token oluşturuldu.
    }
    else {
        return new Response(null, 'Giriş Bilgileri Hatalı').c_400(res)
    }


}


const getProfile = async (req,res) => {
    
    const user = await User.findById(req.params.id)

    if(user) return new Response(user, 'kullanıcı bilgileri').success(res)
    else throw new APIError('Böyle bir kullanıcı mevcut değildir.', 404)
}

const editProfile = async (req,res) => {

    const user = await User.findById(req.user._id) //*token control
    const updateInfo = req.body //* güncellenecek kullanıcı bilgisi

    if(user) {
        const updatedUser = await User.findByIdAndUpdate(user._id, updateInfo , { new: true })
        return new Response(updatedUser,'güncellenen kullanıcı bilgileri').success(res)
    }   
    else {
        throw new APIError('token bulunamadı', 401)
    }
    
}

const getAvatar = async (req,res) => {
    const user = await User.findById(req.params.id)
    const avatar = user.avatar
    if(user) return new Response({avatar}, "Kullanıcı avatarı").success(res)
}

const editAvatar = async (req,res) => {
    const user = await User.findById(req.user._id)  //?token göre kullanıcı bulma
    let file = req.savedImages[0]
   
    if(!user) throw new APIError('Kullanıcı bulunamadı', 401)

    const result = await User.findByIdAndUpdate(user._id, {$set : {'avatar' : file}}, { new: true })
    return new Response(result, 'Güncellenen kullancı avatarı').success(res)
    
}


const forgotPassword = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({ email })

    if (!user) {
        throw new APIError('Böyle bir email adresi mevcut değildir.')
    }

    const resetCode = crypto.randomBytes(3).toString('hex'); 
    console.log(resetCode)

    const mailOptions = {
        from: process.env.EMAIL_ADRESS,
        to: email,
        subject: "Şifre Sıfırlama",
        text: "Şifre Sıfırlama Kodunuz " + resetCode
    }

    await sendMail(mailOptions)

    await User.updateOne({email}, {reset : {code : resetCode, time : moment(new Date()).add(15,'minute').format('YYYY-MM-DD HH:mm:ss')}  })

    return new Response(true, 'Şifre sıfırlama kodunuz mail adresinize gönderildi.').success(res)


}

const forgotPasswordCheckCode = async (req,res) => {
    const email = req.body.email
    const code = req.body.code

    const user = await User.findOne({email})
    if(!user || code !== user.reset.code) throw new APIError('Email veya kod hatalı', 404)

    const nowTime = moment(new Date()) //* şuanki saati aldık.
    const dbTime = moment(user.reset.time) //* veritabanına kaydedilen zamanı aldık.
    const timeDiff = dbTime.diff(nowTime, 'minutes') //* veritabanındakı zamandan şuanki zamanı çıkarttık.

    if(timeDiff >=0 && code){
        const temporaryToken = await authMiddlewares.createTemporaryToken(user)

        return new Response({temporaryToken}, 'İşlem başarılı, Şifre sıfırlama yapabilirsiniz.').success(res)
    }
    else return new Response(false, 'İşlem başarısız, Gönderilen kod zaman aşımına uğradı.').c_403(res)
    
}

const resetPassword = async(req,res) => {
    const password = req.body.password
    const temporaryToken = req.body.temporaryToken

    const decodedToken = await authMiddlewares.decodedTemporaryToken(temporaryToken)
    console.log("çözümlenmiş token", decodedToken)

    if(!decodedToken) throw new APIError('Token Yok', 401)

    const hashPassword = await bcrypt.hash(password,10)

    await User.findByIdAndUpdate({_id : decodedToken._id}, {reset : {code : null, time : null}, password : hashPassword})

    return new Response(true, 'Şifre sıfırlama işlemi başarılı.').success(res)
}


const listFavorite = async (req,res) => {
    const user = await User.findById(req.user._id)  //* token control
    if(!user) throw new APIError('kullanıcı mevcut degil', 401)

    const favorites = await User.findById(user._id).select('favorites')  //* favorite control
    console.log(favorites.favorites)
    if(favorites.favorites.length === 0 ) throw new APIError('kullanıcının favoriler listesi boş', 404)

    const host = await Host.find( {_id : {$in : favorites.favorites}} ).select('location hostType numberOfGuests price images') //* list favorites
    return new Response(host, 'kullanıcının favorileri.').success(res)

}

const addFavorite = async (req,res) => {
    
    const user = await User.findById(req.user._id)  //* token control
    if(!user) throw new APIError('kullanıcı mevcut degil', 401)

    const hostId = req.params.id //* host id
    console.log(hostId)

    const host = await Host.findOne({_id : hostId}) //* host control
    if(!host) throw new APIError('mekan bulunamadı', 404)

    let hostControl = await User.findById(user._id).select('favorites') //* daha önce favorilere eklenmiş ise tekrar ekleme
    hostControl = hostControl.favorites
    console.log('hostControl', hostControl)
    if(hostControl.includes(host._id)) throw new APIError('zaten favorilere eklenmiş bir mekan.', 400)
    
    user.favorites.push(host._id) //* favorilere ekle.
    await user.save()
    .then(data => {
        return new Response(null, 'favorilere eklendi').success(res)
    }).catch(err => {
        console.log(err)
        throw new APIError('hata! favorilere eklenirke bir hata meydana geldi', 500)
    })

}

const deleteFavorite = async (req,res) => {

    const user = await User.findById(req.user.id) //*token control
    if(!user) throw new APIError('kullanıcının yetkisi yok', 401)

    let favorites = await User.findById(req.user.id).select('favorites')
    favorites = favorites.favorites
    if(favorites.length === 0) throw new APIError('silinecek favori mekan bulunamadı', 404)

    const hostId = req.params.id //* silinecek mekanı çıkartarak yeni dizi oluşturduk
   
    const newFavorites = favorites.filter(data => data.toString() !== hostId)
    console.log('newFavoritessssssssssss', newFavorites)

    user.favorites = newFavorites //* favorites'i yeni diziyle güncelledik.
    await user.save()
    .then(data => {return new Response(data, 'Silme işlemi başarılı!').success(res)})
    .catch(err => {throw new APIError('silme işlemi sırasında hata meydana geldi', 500)})

}



//* mekan'a puan ver.
//* mekanın'un puanlarını gör

//* mekana'a yorum yap.
//* mekanın'un yorumlarını oku


module.exports = {
    register, login, forgotPassword,forgotPasswordCheckCode,resetPassword,editProfile, getProfile,getAvatar,editAvatar,
    listFavorite, addFavorite, deleteFavorite
}