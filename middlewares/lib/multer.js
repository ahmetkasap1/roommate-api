const multer = require('multer');

const path = require('path');
const fs = require("fs");
const APIError = require('../../utils/Error');
 

const allowedMimeTypes = [".jpg", ".jpeg", ".png"]

const storage = multer.diskStorage({
    destination: function (req, file, cb) {   //* hedefi gösteriyoruz (dosyanın nereye yükleneceğini belirtiyoruz.)
        const rootDir = path.dirname(require.main.filename) //* ana dosyanın tam yolunu aldık. 
        fs.mkdirSync(path.join(rootDir, "/public/uploads"), { recursive: true }) //* "/public/uploads" dizinin oluştur ve rootDir ile birleştir.
        cb(null, path.join(rootDir, "/public/uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); //* benzersiz bir sayı oluştur.

        const originalName = file.originalname; //* kullanıcının girdiği resmin orginal ismini al.
        const ext = path.extname(originalName); //* orijinal ismin uzantısını al. (.jpg gibi)
        const url = 'images' + '-' + uniqueSuffix + ext //* benzersiz değer ile birlikte dosyayı public klasörü altına kaydet.

        if (!req.savedImages) req.savedImages = [] //* req de savedImages adında bir dizi oluştur, tanımlı değilse

        if(allowedMimeTypes.includes(ext)) {
            try {
                if (req.savedImages.length >= 10) {
                    throw new APIError('En fazla 10 dosya yükleyebilirsiniz.', 400);
                } 
                else {
                    req.savedImages = [...req.savedImages, url]  //* gelen fotoğrafları veya fotoğrafı savedImages aktar. 
                    cb(null, url); 
                }
                
            } catch (error) {
                cb(error)
            }
           
        }
        else{
            try {
                throw new APIError('Bu resim türü desteklenmemektedir.',404)   
            } catch (error) {
                cb(error)
                
            }
        }
 
    }
});

const upload = multer({ storage: storage });



module.exports = upload