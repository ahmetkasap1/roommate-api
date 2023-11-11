const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //* 15 dakika boyunca sınırlama

  limit: (req,res) => {
    if(req.url === '/users/login' || req.url === '/users/register') {
        return 10  //* 10 defa istek atılabilir
    }
    else{
        return 100 //* 100 defa istek atılabilir
    }

  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,


  message: "Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin."

});

module.exports = limiter