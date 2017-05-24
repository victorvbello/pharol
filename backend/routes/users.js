var config=require('../config');

var express = require('express');
var router = express.Router();

//Agrega un nuevo usuario
router.post('/', function(req, res) {
  var body=req.body;
  var userData={
    user:body.user,
    password:body.password
  }
  if(userData.user!="" && userData.password!=""){
    queryVerifi = 'SELECT * FROM user WHERE name=? ALLOW FILTERING';
    config.clientCassandra.execute(queryVerifi, [userData.user])
    .then(result=>{
      if(result.rowLength==0){
        queryInsert = 'INSERT INTO user (id,name,password) VALUES (?,?,?)';
        var idGenerate=config.cassandra.types.Uuid.random();
        config.clientCassandra.execute(queryInsert, [idGenerate,userData.user,userData.password])
        .then(result=>{
          var id=idGenerate;
          return  res.json({success:true,id:id,message:"Usuario guardado"})},
          error=>{return res.status(403).json({success:false,error:"No se pudo guardar el usuario"})});
      }else{
        return res.status(403).json({success:false,error:"No se pudo guardar el usuario"});
      }
    },
    error=>{return res.status(403).json({success:false,error:"No se pudo guardar el usuario"})});       
  }else{
    res.status(403).json({success:false,error:"No se pudo guardar el usuario, datos requeridos"});
  }  
});

//Edita el usuario logiado
router.put('/', function(req, res) {
  var idUser=req.decodedToken.id;
  var body=req.body;
  var userData={
    user:body.user,
    password:body.password
  }
  if(userData.user!="" && userData.password!=""){
    queryUpdate = 'UPDATE user set password=? WHERE id=? AND name=?';
    config.clientCassandra.execute(queryUpdate, [userData.password,idUser,userData.user])
    .then(result=>{return res.json({success:true,message:"Usuario editado"})},
      error=>{return res.status(403).json({success:false,error:"No se pudo editar el usuario"})});
  }else{
     res.status(403).json({success:false,error:"No se pudo editar el usuario, datos requeridos"});
  }
});


module.exports = router;
