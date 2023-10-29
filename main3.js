const net = require('net');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

let currentSocket = null;
let fileIndexToSend = 0;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt('>> ');

const server = net.createServer(socket => {
    console.log('Cliente conectado');
    currentSocket = socket;

    rl.prompt();

    socket.on('data', data => {
        const receivedData = data.toString().trim();
        console.log(`Datos recibidos del cliente: ${receivedData}`);
    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
        fileIndexToSend = 0;
        currentSocket = null;
    });

    socket.on('error', err => {
        console.log('Error en la conexión:', err.message);
    });
});

const rutas = {
    // 8887: 'tramas2/MCM_TEST',
    8887: 'tramas2/Elimination_TEST',
    8888: 'tramas2/elim',
}

rl.on('line', line => {

    if (line.trim() === 'reset') {
        fileIndexToSend = 0; // Reiniciar el índice si se teclea 'reset'
        console.log('Índice de archivo reiniciado.');
    }

    if (currentSocket && line.trim() === 'enviar') {
        let directoryPath = path.join(__dirname, rutas[port]);
        if(!directoryPath){
            console.log('Puerto desconocido');
            rl.prompt();
            return;
        }

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error('Error al leer el directorio:', err.message);
                rl.prompt();
                return;
            }

            const jsonFiles = files.filter(file => path.extname(file) === '.json');
            jsonFiles.sort((a, b) => {
                const [yearA, monthA, dayA, hourA, minA, secA, millisA] = a.split('-').map(num => parseInt(num, 10));
                const [yearB, monthB, dayB, hourB, minB, secB, millisB] = b.split('-').map(num => parseInt(num, 10));
                const dateA = new Date(yearA, monthA - 1, dayA, hourA, minA, secA, millisA);
                const dateB = new Date(yearB, monthB - 1, dayB, hourB, minB, secB, millisB);
                return dateA - dateB;
            });

            if (fileIndexToSend < jsonFiles.length) {
                const filePath = path.join(directoryPath, jsonFiles[fileIndexToSend]);
                const file = fs.readFileSync(filePath, 'utf-8');
                currentSocket.write(file, 'utf-8');
                console.log(`Archivo ${filePath} enviado`);
                fileIndexToSend++;
            } else {
                console.log('No hay más archivos para enviar');
            }
        });
    }
    rl.prompt();
});

const port = process.argv[2] || 8887;
server.listen(port, () => {
    console.log(`Servidor TCP escuchando en el puerto ${port}`);
});
