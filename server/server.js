'use strict';

const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const server = require('http').Server(app);
const io = require('socket.io')(server, {serveClient: true});

nunjucks.configure('../client/views', {
    autoescape: true,
    express: app
});

app.use('/assets', express.static('../client/public'));

app.get('/', (req, res) => {
	res.render('index.html', {date: new Date()});
});

io.on('connection', function(socket) {
	socket.emit('connected', 'You are connected!');

	socket.join('all');

	socket.on('msg', content => {
		console.log(content);
		const obj = {
			date: new Date(),
			content: content,
			username: socket.id
		};

		socket.emit('message', obj);
		socket.to('all').emit('message', obj);
	});
});

server.listen(3000, () => {
	console.log('Server started');
});