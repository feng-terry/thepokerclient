const express = require('express');
const http = require("http")
const socket = require('socket.io')
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.use(express.static('/client/public'))

const io = socket(server)
io.on('connection',(socket) => console.log('made socket connection'))