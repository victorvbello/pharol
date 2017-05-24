var config=require('../config');

var jwt = require('jsonwebtoken');
var express = require('express');

var router = express.Router();

router.use(function(req, res, next) {
  var token = req.headers['x-access-token'];
  var isPublic=((req.path.indexOf('public')!=-1 || (req.path.indexOf('login')!=-1))?true:false);
  if(!isPublic){//Si es de acceso publico no requiere token
    if (token) {//Se espera token desde el header x-access-token
      jwt.verify(token,config.SecretJWT, function(err, decoded) {  
        if (err) {
          return res.status(403).json({ success: false, message: 'Fallo al autenticar el token' });    
        } else {
          req.decodedToken = decoded;
          req.encodeToken=token;
          if(decoded.id!=""){//Valido que el id de usuario del token exista en db
            query = 'SELECT * from user WHERE id=?';
            config.clientCassandra.execute(query, [decoded.id])
            .then(result=>{
              if(result.rowLength==1){
                next();
              }else{
                return res.status(403).json({ success: false, message: 'Fallo al autenticar el token' });
              }
            },erro=>{return res.status(403).json({ success: false, message: 'Fallo al autenticar el token' })});             
          }else{
             res.status(403).json({ success: false, message: 'Fallo al autenticar el token' });
          }
         
        }
      });
    } else {
      return res.status(403).send({status: false,message: 'token invalido'});
    }
  }else{
    next();
  }
});

module.exports = router;