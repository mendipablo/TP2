from flask import Flask, render_template, request, redirect, url_for
import redis
import random


app= Flask(__name__)

tick=['Ticket01','Ticket02','Ticket03','Ticket04','Ticket05','Ticket06','Ticket07'
,'Ticket08','Ticket09','Ticket10','Ticket11']
precios=[100, 70, 50, 165, 200, 340, 120]

def connect_db():
	conexion = redis.StrictRedis(host='127.0.0.1', port=6379, decode_responses=True, charset='utf-8', db=1)
	if(conexion.ping()):
		print("conectando")
	else:
		print("error")
	return conexion

@app.route('/')
def index():
    dic={}
    r=connect_db()
    #r.lpush('Ticket01', 'Disponible')
    #r.lpush('Ticket02', 'Disponible')
    #r.lpush('Ticket03', 'Disponible')
    #r.lpush('Ticket04', 'Disponible')
    #r.lpush('Ticket05', 'Disponible')
    #r.lpush('Ticket06', 'Disponible')
    #r.lpush('Ticket07', 'Disponible')
    #r.lpush('Ticket08', 'Vendido')
    #r.lpush('Ticket09', 'Disponible')
    #r.lpush('Ticket10', 'Vendido')
    #r.lpush('Ticket11', 'Vendido')
    

    key= r.keys('*')
    for t in tick:
        if t in key:
            for k in key:
                v=r.lrange(k, 0, -1)
                value= ''.join(v)
                value.encode('utf-8')
                dic[k]= value
        else:
            r.lpush(t, 'Disponible')
    precio= random.choice(precios)
           
    return render_template('index.html', dic=dic, precio=precio)


@app.route('/reserva', methods=['GET', 'POST'])
def reservar():
    r=connect_db()
    key= request.args.get('k')
    precio= request.args.get('p')
    value= r.lrange(key, 0,  -1)
    
    r.lrem(key, 0, 'Disponible')
    r.lpush(key, 'Reservado')
    r.expire(key, 240)
    
   

    return render_template('reserva.html', key= key, precio=precio)

@app.route('/compra', methods=['GET', 'POST'])
def comprar():
    r=connect_db()
    key= request.args.get('k')
    r.lrem(key, 0, 'Reservado')
    r.lpush(key, 'Comprado')
    return redirect(url_for('index'))

if __name__ == '__main__':
	app.run(host='localhost', port='5000', debug= True)
	