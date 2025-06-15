const net = require('net');
const readline = require('readline');
const colors = require('colors');

class ChatClient {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.setupConnection();
    }

    setupConnection() {
        this.rl.question('Enter server IP (default: localhost): ', (ip) => {
            ip = ip || 'localhost';
            this.rl.question('Enter server port (default: 3000): ', (port) => {
                port = port || 3000;
                this.connect(ip, parseInt(port));
            });
        });
    }

    connect(ip, port) {
        this.socket = net.createConnection({ host: ip, port: port }, () => {
            console.log('Connecting to server...'.yellow);
        });

        this.socket.setEncoding('utf8');

        this.socket.on('data', (data) => {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log(data.trim());
            this.prompt();
        });

        this.socket.on('end', () => {
            console.log('\nDisconnected from server'.red);
            process.exit();
        });

        this.socket.on('error', (err) => {
            console.error('Connection error:'.red, err);
            process.exit(1);
        });

        this.rl.on('line', (input) => {
            if (this.socket && !this.socket.destroyed) {
                this.socket.write(`${input}\n`);
                this.prompt();
            }
        });
    }

    prompt() {
        this.rl.prompt(true);
    }
}

new ChatClient();
