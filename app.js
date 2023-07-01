const http = require('http');
const { Server } = require("socket.io");
const { spawn } = require('child_process');
// const utf8 = require('utf8');

const http_server = http.createServer();
const port = 3000;
const socket_server = new Server(http_server);

socket_server.on('connection', (soc) => {
    // Spawing a JAR file process
    const jar_process = spawn('java', ['-jar', './resources/feed-play.jar']);

    jar_process.stdout.on('data', (data) => {
        // const res = encoding.convert(data, 'ASCII', 'UTF-8');
        const res = JSON.parse(JSON.stringify(data));
        // const res = utf8.decode(byteString)
        // const outputData = res.toJSON();
        soc.emit('output', res);
    });

    soc.on('disconnect', () => {
        jar_process.kill();
        console.log('Disconnected');
    })
})

http_server.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})


