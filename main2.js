const net = require('net');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

let currentSocket = null;

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
        currentSocket = null;
    });

    socket.on('error', err => {
        console.log('Error en la conexión:', err.message);
    });
});

const rutas = {
    // 8887: 'tramas2/5000M_1000M_TEST',
    8887: 'tramas2/Elimination_TEST',
    8888: 'tramas2/elim',
}

rl.on('line', line => {
    if (currentSocket) {
        if (line.trim() === 'enviar') {
            let directoryPath;

            directoryPath = path.join(__dirname, rutas[port]);
            if(!directoryPath){
                console.log('Puerto desconocido');
                return;
            }

            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    console.error('Error al leer el directorio:', err.message);
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

                let index = 0;
                const sendFile = () => {
                    if (index < jsonFiles.length) {
                        const filePath = path.join(directoryPath, jsonFiles[index]);

                        fs.readFile(filePath, 'utf-8', (err, file) => {
                            if (err) {
                                console.error(`Error al leer el archivo ${filePath}:`, err.message);
                                return;
                            }

                            currentSocket.write(file, 'utf-8', () => {
                                console.log(`Archivo ${filePath} enviado`);
                                index++;
                                setTimeout(sendFile, 4000);
                            });
                        });
                    }
                };

                sendFile();
            });
        }
    }
    rl.prompt();
});

const port = process.argv[2] || 8887;
server.listen(port, () => {
    console.log(`Servidor TCP escuchando en el puerto ${port}`);
});
