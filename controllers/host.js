const Host = require('../models/host')
const User = require('../models/user')
const APIError = require('../utils/Error')
const Response = require('../utils/Response')

const addHost = async (req,res) => {  //* Kullanıcı mekanlarını paylaşabilir.

    
    if(!req.user) throw new APIError('yetkisiz işlem', 401) //check token

    const user = await User.findById(req.user._id) //database control
    if(!user) throw new APIError('kullanıcı bulunamadı', 404)

    const hostInfo = JSON.parse(req.body.data)
    hostInfo.images = req.savedImages
    hostInfo.userRef = user._id

    const host = new Host (hostInfo)
    host.save()
    .then(data => {
        return new Response(data, 'kayıt başarılı').success(res)
    }).catch(err => {
        throw new APIError('kayıt sırasında bir hata meydana geldi', 500)
    })
}

const updateHost = async (req,res) => { //* Kullanıcı listelediği mekanlarda güncelleme yapabilir.
    

    if(!req.user) throw new APIError('Yetkisiz işlem', 401)

    const host = await Host.findOne({userRef : req.user._id })
    if(!host) throw new APIError('Kullanıcıya ait host bulunamadı', 404)

    const hostInfo = JSON.parse(req.body.data)
    hostInfo.images = req.savedImages
    hostInfo.userRef = req.user._id

    await Host.findByIdAndUpdate(req.params.id, hostInfo)
    .then(data => {
        return new Response(null, 'güncelleme işlemi başarılı').success(res)
    })
    .catch(err => {
        throw new APIError('güncelleme işlemi sırasında hata oluştu', 500)
    })
    

}

const deleteHost = async (req,res) => {  //* kullanıcı listelediği mekanları silebilir.

    if(!req.user) throw new APIError('Yetkisiz işlem', 401)

    const host = await Host.findOne({userRef : req.user._id})
    if(!host) throw new APIError('kullanıcıya ait host bulunamadı', 404)

    const hostId = req.params.id

    await Host.findByIdAndDelete(hostId)
    .then(data => {
        return new Response(data, 'silme işlemi başarılı').success(res)
    })
    .catch(err => {
        throw new APIError('silme işlemi sırasında hata meydana geldi', 500)
    })

}
 
const getHost = async (req,res) => {   //* kullanıcı id'sine göre kiraladığı mekanları listele.

    const id = req.params.id 

    const user = await User.findById(id)
    if(!user) throw new APIError('kullanıcı bulunamadı', 401)

    const host = await Host.find({userRef : id})
    if(!host.length) return new Response(null, 'kullanıcının işyeri paylaşımı yok').c_404(res) 
    else return new Response(host, 'kullanıcının hostları').success(res)

}


const mainHost = async (req,res) => { //* Tüm kayıtlar. Anasayfa için. Şimdilik basit.
    const host = await Host.find({})
    return new Response(host, 'tüm kayıtlar').success(res)
}

const hostType = async (req,res) => { //* Categoriye göre tüm kayıtlar. Örneğin ev, tekne 
    const hostType = req.params.type

    const host = await Host.find({hostType : hostType})
    if(!host.length) throw new APIError(`${hostType} isminde categori bulunamadı`, 404)
    else return new Response(host, 'bulunan mekanlar').success(res)
}

const allFilter = async (req,res) => { //* Lokasyon, ev tipi, fiyat ve misafir sayısına göre filtrleme

    const host = await Host.find({
        location: req.query.location,
        hostType: req.query.hostType,
        numberOfGuests:  req.query.numberOfGuests,
        price: { $gte: req.query.minPrice, $lte: req.query.maxPrice }
    })
    if (!host.length) throw new APIError('filitreleme sonucunda kayıt bulunamadı', 404)
    else return new Response(host, 'Filtreleme sonucu bulunan mekanlar').success(res)
      
}



module.exports = {
    addHost, getHost, updateHost, deleteHost,mainHost,hostType,allFilter
}