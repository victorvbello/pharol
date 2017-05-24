var config=require('../config');

var express = require('express');
var router = express.Router();

var indexAlgolia=config.clientAlgolia.initIndex('songs');

//Espesificación de parametros de busqueda
indexAlgolia.setSettings(
  {'searchableAttributes': ['name','artist','gender']}, 
  function(err, content) {
   if(err){
     console.log(err);
   }
  });

//Lista de todas las canciones
router.get('/public', function(req, res) { 
  indexAlgolia.search('',function(err, content) {
    if (err) {
      res.status(501).json({success:false,error:"Error al listar canciones "+err});
    }else{
      res.json({success:true,songs:content.hits});
    }
  });
});

//Busca canciones por nombre, artista o genero
router.get('/:search', function(req, res) { 
  var search=req.params.search; 
  indexAlgolia.search(search,function(err, content) {
    if (err) {
      res.status(501).json({success:false,error:"Error en la busqueda "+err});
    }else{
      res.json({success:true,songs:content.hits});
    }
  });
});

//Agrega nuevas canciones
router.post('/', function(req, res) {
  var body=req.body;
  var newSong={
    "name": body.name,
    "gender":body.gender,
    "artist": body.artist,
    "date": new Date().getTime(),
    "userId":req.decodedToken.id
  };
  indexAlgolia.addObject(newSong, function(err, content) {     
    if (err) {
      res.status(501).json({success:false,error:"Error al guardar la cancion "+err});
    }else{
      newSong.id=content.objectID;
      req.app.locals.socket.sockets.in(req.encodeToken).emit('songAdded',newSong);
      res.json({success:true,id:content.objectID});
    }
  });  
});

//Edita canciones existentes
router.put('/', function(req, res) {
  var body=req.body;
  var newSong={
    "name": body.name,
    "gender":body.gender,
    "artist": body.artist,
    "date": new Date().getTime(),
    "userId":req.decodedToken.id,
    "objectID":body.id
  };
   indexAlgolia.saveObject(newSong, function(err, content) {
    if (err) {
      res.status(501).json({success:false,error:"Error al editar la cancion "+err});
    }else{
      res.json({success:true,message:"Se edito la cancion con exito"});
    }
  });  
  
});


//Elimiar canciones existentes
router.delete('/', function(req, res) {
  var body=req.body;
  var songs=body.songs;
  indexAlgolia.deleteObjects(songs, function(err, content) {
    if (err) {
      res.status(404).json({success:false,error:"Error al eliminar la cancion"+err});
    }else{
     res.json({success:true,message:"Se elimino la canción con exito"});
    }
  });
  
});

module.exports = router;
