class Response {
    
    constructor(data = null, message = null){
        this.data = data
        this.message = message
    }

    success(res){
        return res.status(200).json({
            success : true,
            data : this.data,
            message : this.message ?? 'İşlem başarılı'
        })
    }

    created(res){
        return res.status(201).json({
            success : true,
            data : this.data,
            message : this.message ?? 'Kaynak oluşturuldu'
        })
    }



    c_400(res){
        return res.status(400).json({
            success : false,
            data : this.data,
            message : this.message ?? 'Geçersiz istek',
        })
    }   

    c_401(res){
        return res.status(401).json({
            success : false,
            data : this.data,
            message : this.message ?? 'Yetkisiz işlem, yetki gerekiyor.'
        })
    }

    c_403(res){
        return res.status(403).json({
            success : false,
            data : this.data,
            message : this.message ?? 'Sunucu isteği reddeti, veya işleme yetkiniz yok.'
        })
    }

    c_404(res){
        return res.status(404).json({
            success : false,
            data : this.data,
            message : this.message ?? 'Kaynak bulunamadı.'
        })
    }

    c_429(res){
        return res.status(429).json({
            success : false,
            data : this.data,
            message : this.message ?? 'Çok fazla istek atıldı.'
        })
    }



    
    s_500(res){
        return res.status(500).json({
            success : false,
            data : this.data,
            message : this.message ?? 'Sunucuda bir hata oluştu ve istek karşılanamadı.'
        })
    }

    s_501(res){
        return res.status(501).json({
            success : false,
            data : this.data,
            message : this.message ?? 'Sunucu isteği yerine getirecek şekilde yapılandırılmamış.'
        })
    }


    s_503(res){
        return res.status(503).json({
            success : false,
            data : this.data,
            message : this.message ?? 'Sunucu şuanda hizmet vermiyor.'
        })
    }






}

module.exports = Response