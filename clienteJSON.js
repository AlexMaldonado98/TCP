const net = require('net');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const typeTrama = '500M_1000M';


const client = new net.Socket();


const PORT = 8888;
const HOST = '192.0.2.50';

client.connect(PORT, HOST, () => {
    console.log('Conectado al servidor');
    rl.prompt();
});

client.on('data', (data) => {
    console.log('Recibido del servidor:', data.toString());

    const array = data.toString().split(/\x13/g).slice(0, -1);
    console.log("🚀 ~ file: display.controller.js:603 ~ handleTcpData ~ array:", array)

    for (let i = 0; i < array.length; i++) {
        let data2 = JSON.parse(array[i]);
        console.log("🚀 ~ file: clienteJSON.js:32 ~ client.on ~ data2:", data2)
        try {

            // const randomName = Math.random().toString(36).substring(7);
            const date = new Date();
            if (data2) {

                const baseDirectory = `./tramas2/${typeTrama}`;
                if (!fs.existsSync(baseDirectory)) {
                    fs.mkdirSync(baseDirectory, {recursive: true});
                }
                
                
                const fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}.json`;
                
                fs.writeFile(`${baseDirectory}/${fileName}`, JSON.stringify(data2), (err) => {
                    if (err) {
                        console.error('Error al escribir el archivo:', err.message);
                        return;
                    }
                    console.log('Archivo guardado');
                });
                // rl.prompt();
            }
        } catch (error) {
            console.error("Error al manejar los datos:", error);
        }
    }

    // const json = tryParseJSON(data.toString());
    //
    // const randomName = Math.random().toString(36).substring(7);
    // if (json) {
    //
    //     fs.writeFile(`./tramas/${typeTrama}/${randomName}.json`, data.toString(), (err) => {
    //         if (err) {
    //             console.error('Error al escribir el archivo:', err.message);
    //             return;
    //         }
    //         console.log('Archivo guardado');
    //     });
    // }
    //
    // rl.prompt();
});

client.on('close', () => {
    console.log('Conexión cerrada');
    rl.close();
});

client.on('error', (err) => {
    console.error('Error en la conexión:', err.message);
});

// Para enviar datos al servidor
rl.on('line', (line) => {
    client.write(line);
    rl.prompt();
});


function tryParseJSON(str) {
    let parsedData = null;

    try {
        parsedData = JSON.parse(str);
    } catch (err) {
        // Si falla, intentamos eliminar el último carácter y parsear nuevamente.

        try {
            //Remove control characters
            str = str.replace(/[\u0000-\u0019]+/g, "");
            // parsedData = JSON.parse(str.slice(0, -1));
        } catch {

        }
    }

    return parsedData;
}