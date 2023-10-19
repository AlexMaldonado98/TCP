/* Este servidor esta pensado para mandar archivos json segun el puerto de ejecución del servidor
8887 meta contra meta o 8888 Eliminacion cada 5seg manda una trama de tipo JSON */
//Solo puede mantener una sesion activa

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
  
  // Setea el socket actual
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
  8887: 'tramas/mcm',
  8888: 'tramas/elim',
}

rl.on('line', line => {
    if (currentSocket) { 
        if (line.trim() === 'enviar') {
            let directoryPath;
        
            directoryPath = path.join(__dirname, rutas[port])
            if(!directoryPath){
              console.log('Puerto desconocido')
              return
            }

            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    console.error('Error al leer el directorio:', err.message);
                    return;
                }

                const jsonFiles = files.filter(file => path.extname(file) === '.json');

                let index = 0;
                const sendFile = () => {
                    if (index < jsonFiles.length) {
                        const jsonFile = jsonFiles[index];
                        fs.readFile(path.join(directoryPath, jsonFile), 'utf-8', (err, data) => {
                            if (err) {
                                console.error(`Error al leer el archivo ${jsonFile}:`, err.message);
                                return;
                            }
                            currentSocket.write(data, 'utf-8', () => {
                                console.log(`Archivo ${jsonFile} enviado!`);
                                index++;
                                setTimeout(sendFile, 5000);
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

