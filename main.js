/* Este es el servidor que envia tramas de tipo txt escribiendolo en la terminal despues de que
se conecta un usuario (TDT;010;Valery RAMIREZ;MAD;01:10.500;) */
//Solo puede mantener una sesion activa

const net = require('net');
const readline = require('readline');

let currentSocket = null;

const server = net.createServer(socket => {
    if (currentSocket) {
        console.log('Cerrando conexión anterior...');
        currentSocket.end();
    }

    console.log('Cliente conectado');
    currentSocket = socket; 

    socket.on('data', data => {
        const receivedData = data.toString().trim();
        console.log(`Datos recibidos del cliente: ${receivedData}`);
    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
        if (socket === currentSocket) {
            currentSocket = null; 
        }
    });

    socket.on('error', err => {
        console.log('Error en la conexión:', err.message);
    });
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt('>> ');
rl.prompt();

rl.on('line', line => {
    if (currentSocket) {
        currentSocket.write(line, "utf-8");
    }
    rl.prompt();
});

const port = 8887;
server.listen(port, () => {
    console.log(`Servidor TCP escuchando en el puerto ${port}`);
});
