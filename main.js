const net = require('net');
const readline = require('readline');

const server = net.createServer(socket => {
  console.log('Cliente conectado');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt('>> ');
  rl.prompt();

  rl.on('line', line => {
    socket.write(line, "utf-8");
    rl.prompt();
  });

  socket.on('data', data => {
    const receivedData = data.toString().trim();
    console.log(`Datos recibidos del cliente: ${receivedData}`);
  });

  socket.on('close', () => {
    console.log('Cliente desconectado');
  });

  socket.on('error', err => {
    console.log('Error en la conexión:', err.message);
  });
});

const port = 8888;
server.listen(port, () => {
  console.log(`Servidor TCP escuchando en el puerto ${port}`);
});
