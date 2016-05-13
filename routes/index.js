var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const crypto = require('crypto'); 
mongoose.connect('localhost:27017/test');

var Schema = mongoose.Schema;

var trooperDataSchema = new Schema({
  user: {type: String, required: true, unique: true, trim: true},
  nombre: {type: String, required: true, trim: true},
  apellidos: {type: String, required: true, trim: true},
  password: {type: String, required: true, trim: true},
  nivelmilitar: {type: String, required: true, trim: true},
  habilitado_para_usar_app: {type: Boolean, required: true, trim: true}
});

var TrooperData = mongoose.model('TrooperData', trooperDataSchema);

//hash de contraseñas
var key1 = "straub123";
var key2 = "delahoz123";

crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', (err, key1) => 
	{ 
	if (err) throw err; 
		//console.log(key.toString('hex')); // 'c5e478d...1469e50' 
	});

crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', (err, key2) => 
	{ 
	if (err) throw err; 
		//console.log(key.toString('hex')); // 'c5e478d...1469e50' 
	});


//borrar todos los usuarios al comenzar
TrooperData.remove({},function(err, removed){});

//usuarios ingresados por defecto (2 en total)
var usuario1 = {
    user: "straub",
    nombre: "eduardo",
    apellidos: "straub",
    password: key1,
    nivelmilitar: 1,
    habilitado_para_usar_app: true,
  };
  var data = new TrooperData(usuario1);
  data.save();

var usuario2 = {
    user: "delahoz",
    nombre: "eduardo",
    apellidos: "de la hoz henriquez",
    password: key2,
    nivelmilitar: 3,
    habilitado_para_usar_app: false,
  };
  var data = new TrooperData(usuario2);
  data.save();
  
//index
router.get('/', function(req, res, next) {
  res.render('index');
});

//login
router.post('/login', function(req, res, next) {

/*if(key1.toString('hex') === key2.toString('hex')){
	console.log("IGUALES");
}else{
	console.log("DIFERENTES");
}*/

  var usuario = req.body.user;
  var clave = req.body.password;
  var error_texto = "Ingrese nombre de usuario";
  var error_inesperado = "Error inseperado";
  var error_clave = "Ingrese clave de usuario";
  var error_no_esta = "Usuario no se encuentra en la base de datos";

crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', (err, clave) => 
	{ 
	if (err) throw err; 
		//console.log(clave.toString('hex')); // 'c5e478d...1469e50' 
	});


  TrooperData.find({user:usuario, password: clave}, function(err, results){

	console.log("nombre:" + this.nombre);

	if(err){
		res.render('index', {ingrese_usuario: error_inesperado});
		return;
	}

        if(results.length < 1){
		res.render('index', {ingrese_usuario: error_no_esta});
	   }else{
		res.render('index', {items: results});
	}
  });

});

module.exports = router;

