const path = require('path');
const express = require('express');
const userController = require('../server/controllers/userController');

const app = express();
const PORT = 3000;

// --------- database connection ------
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://exquizzle:admin@clusterzero-acjrx.mongodb.net/scratch', { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  console.log('Connected to Mongo Database');
});
// --------- database connection ------

// --------- Schema imports -----------
// --------- import to Controllers
// --------- Schema imports -----------

// parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/asset', express.static(path.join(__dirname, '../client/asset')));

app.get('*', (req, res) => {
  console.log('inside the catchall no matching routes');
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.post('/signup', userController.createUser);
app.post('/login', userController.verifyUser);

const server = app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
const socket = require('socket.io');

const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection:', socket.id);
  // function to receive code
  socket.on('mouse', mouseMsg);
  socket.on('clear', () => {
    socket.broadcast.emit('clearBack');
  });
  socket.on('down', (data) => {
    socket.broadcast.emit('down', data);
  });
  socket.on('message', (newMessage) => {
    console.log(newMessage)
    socket.broadcast.emit('messageBraodcast', newMessage);
  })

  // receieves mouse coordinates
  function mouseMsg(data) {
    // broadcasts data to everyone who is connected
    socket.broadcast.emit('mouseback', data);
    // globally emit data to everyone
  }
}
