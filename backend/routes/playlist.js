var config=require('../config');

var express = require('express');
var router = express.Router();

//Lita las playlist de un usuario
router.get('/', function(req, res) {
  res.send('Lista de playlist');
});

//Agrega nuevas playlist
router.post('/', function(req, res) {
  var idUser=req.decodedToken.id;
  var body=req.body;
  var playlistData={
    name:body.name,
    songs:(body.songs.length==0)?[]:body.songs
  }
  if(playlistData.name!="" && idUser!=""){
    queryVerifi = 'SELECT * FROM playlist WHERE name=? and idUser=? ALLOW FILTERING';
    config.clientCassandra.execute(queryVerifi, [playlistData.name,idUser])
    .then(result=>{
      if(result.rowLength==0){
        queryInsert = 'INSERT INTO playlist (id,name,songs,idUser) VALUES (?,?,?,?)';
        var idGenerate=config.cassandra.types.Uuid.random();
        config.clientCassandra.execute(queryInsert, [idGenerate,playlistData.name,playlistData.songs,idUser])
        .then(result=>{
          playlistData.id=idGenerate;
          req.app.locals.socket.sockets.in(req.encodeToken).emit('playlistAdded',playlistData);
          return  res.json({success:true,id:idGenerate,message:"lista de reproducción guardada"})},
          error=>{return res.status(403).json({success:false,error:"No se pudo guardar la lista de reproducció"})});
      }else{
        return res.status(403).json({success:false,error:"No se pudo guardar la lista de reproducción"});
      }
    },
    error=>{return res.status(403).json({success:false,error:"No se pudo guardar la lista de reproducción"})});       
  }else{
    res.status(403).json({success:false,error:"No se pudo guardar la lista de reproducción, datos requeridos"});
  }  
});

//Edita playlist existentes
router.put('/', function(req, res) {
  var idUser=req.decodedToken.id;
  var body=req.body;
  var playlistData={
    name:body.name,
    songs:(body.songs.length==0)?[]:body.songs,
    idPlaylist:body.id
  }
  if(playlistData.name!="" && playlistData.idPlaylist!=""){
    queryUpdate = 'UPDATE playlist set name=?,songs=? WHERE id=? AND iduser=?';
    config.clientCassandra.execute(queryUpdate, [playlistData.name,playlistData.songs,playlistData.idPlaylist,idUser])
    .then(result=>{
      return  res.json({success:true,message:"lista de reproducción editada"})},
      error=>{return res.status(403).json({success:false,error:"No se pudo editar la lista de reproducción"})});      
  }else{
    res.status(403).json({success:false,error:"No se pudo editar la lista de reproducción, datos requeridos"});
  }  
});

//Eliminar playlist existentes
router.delete('/', function(req, res) {
  var idUser=req.decodedToken.id;
  var body=req.body;
  var playlists=body.playlists;
  if(playlists.length!=0 && idUser!=""){
    queryUpdate = 'DELETE FROM playlist WHERE id IN ? AND iduser=?';
    config.clientCassandra.execute(queryUpdate, [playlists,idUser])
    .then(result=>{
      return  res.json({success:true,message:"lista de reproducción eliminada"})},
      error=>{return res.status(403).json({success:false,error:"No se pudo eliminar la lista de reproducció"})});      
  }else{
    res.status(403).json({success:false,error:"No se pudo elimiar la lista de reproducción, datos requeridos"});
  }  
});

module.exports = router;
