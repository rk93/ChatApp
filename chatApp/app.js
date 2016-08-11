var express = require('express'),
	path = require('path'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	nicknames = [];
server.listen(3000);


app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');

app.get('/',function(req,res){
	res.sendFile(__dirname+'/views/index.html');
});

io.sockets.on('connection',function(socket){
	socket.on('new user',function(data,callback){
		//console.log(data);
		if(nicknames.indexOf(data)!=-1){
			callback(false);
		}else{
			
			callback(true);
			socket.nicknames = data;
			nicknames.push(socket.nicknames);
			console.log("nicknames are"+' '+nicknames);
			updatenicknames();	
			
		}
	});
	
	function updatenicknames(){
		io.sockets.emit('username',nicknames);
		}
	
	socket.on('first message',function(data){
		io.sockets.emit('new message',{msg:data,name:socket.nicknames});
		//sockets.broadcast.emit('new message',data);
		
	});
	
	socket.on('disconnect',function(data){
		if(!socket.nicknames) return;
		console.log(socket.nicknames);
		var removedName = nicknames.splice(nicknames.indexOf(socket.nicknames),1);
		console.log("removed element"+" "+ removedName);
		updatenicknames();
	});
	
});