var redis =require('redis')
var express = require('express')
var app = express()
var port = 8000
var bodyParser = require('body-parser');

var cliente = redis.createClient(6379, 'redis')
app.set('port', port)
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug');
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static('public'));
app.use(bodyParser());



cliente.on('connect', function(){
	console.log('conectando a redis');
})


app.get('/', function(req, res){
	res.render('index')
})


app.get('/personaje', (req, res) => res.render('agregar'));



app.get('/del' , function(req, res){
	res.render('quitar')
});

app.post('/agregar', function(req, res){
	var ep= req.body.episodio;
	var per= req.body.personaje;
	cliente.lpush(ep, per, redis.print)
	res.render('agregar',{
		mensaje: 'Personaje agregado!!'
	})
	
});

app.post('/quitar', function(req, res){
	var ep= req.body.episodio;
	var per= req.body.personaje;
	cliente.lrem(ep, 0, per, redis.print)

	res.render('quitar')

});



app.get('/listar', function(req, res){
	var ep= `${req.query.ep}`
	cliente.lrange(ep, 0, -1, function (err,value){
		
	res.render('listado', {
				lista: value
			});
	
	
});
});




app.listen(app.get('port'), (err) => {
	console.log(`Server running on port ${app.get('port')}`)
})



