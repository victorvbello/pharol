var config=require('../config');

var express = require('express');
var jwt = require('jsonwebtoken');

var router = express.Router();

//Inicia la session para el usuario
router.post('/login', function(req, res) {
  var body=req.body;
  var userData={
    user:body.user,
    password:body.password
  }
  if(userData.user!=""  && userData.password!=""){
    query = 'SELECT * FROM user WHERE name = ? and password=? ALLOW FILTERING';
    config.clientCassandra.execute(query, [userData.user,userData.password])
    .then(result =>{
      if(result.rowLength==1){// Si el usuario esta en la db creo el token 
        userData=result.rows[0];
        var token = jwt.sign(userData, config.SecretJWT, {
          expiresIn:"12h"
        });
        res.json({success:true,token: token});
      }else{
        res.status(403).json({success:false,error:"Usuario Invalido"});
      }
    },error=>{
       res.status(403).json({success:false,error:"Usuario Invalido"});
    });
  }else{
    res.status(403).json({success:false,error:"Usuario Invalido"});
  }  
});


module.exports = router;
