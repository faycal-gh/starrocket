const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8081 });
server.on('connection', (socket) => {
    console.log('Client connected');
    setInterval(() => {
        socket.send(JSON.stringify({
            speedTime: { time: Date.now(), speed: Math.random() * 100 },
            temperatureTime: { time: Date.now(), temperature: Math.random() * 50 },
            humidityTime: { time: Date.now(), humidity: Math.random() * 100 },
            accelerationTime: {
                time: Date.now(),
                accelerationX: Math.random() * 5,
                accelerationY: Math.random() * 5 + 2,
                accelerationZ: Math.random() * 5 + 4
            }
        }));
    }, 1000);

    socket.on('message', (message) => {
        console.log(`Received: ${message}`);
    });
});
console.log('WebSocket server running on ws://localhost:8081');
