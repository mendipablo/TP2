var redis =require('redis')
var express = require('express')
var app = express()
var port = 8000

var cliente = redis.createClient(6379, 'redis')
app.set('port', port)

cliente.on('connect', function(){
	console.log('conectando a redis');
})



app.get('/personaje', function(req, res) {
	var ep= `${req.query.ep}`
	var per= `${req.query.per}`

	cliente.lpush(ep, per, redis.print)

	res.send('Agregado personaje '+ per +' en episodio '+ ep );

});

app.get('/quitar', function(req, res){

	var ep= `${req.query.ep}`
	var per= `${req.query.per}`
	cliente.lrem(ep, 0, per, redis.print)
	res.send('Quitado '+ per+' de episodio '+ ep);
});

app.get('/listar', function(req, res){
	var ep= `${req.query.ep}`
	cliente.lrange(ep, 0, -1, function (err,value){
	res.send(value);


});
});




app.listen(app.get('port'), (err) => {
	console.log(`Server running on port ${app.get('port')}`)
})



