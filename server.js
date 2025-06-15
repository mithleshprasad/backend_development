const net = require('net');
const PORT = 3000;
const chalk = require('chalk');

class ChatServer {
    constructor() {
        this.clients = new Map();
        this.messageHistory = [];
         // Server startup banner
        console.log(chalk.green.bold(`
          ██████  ██▓  █████▒██▓    ▄▄▄       ██▓███   █    ██  ███▄ ▄███▓
        ▒██    ▒ ▓██▒▓██   ▒▓██▒   ▒████▄    ▓██░  ██▒ ██  ▓██▒▓██▒▀█▀ ██▒
        ░ ▓██▄   ▒██▒▒████ ░▒██░   ▒██  ▀█▄  ▓██░ ██▓▒▓██  ▒██░▓██    ▓██░
          ▒   ██▒░██░░▓█▒  ░▒██░   ░██▄▄▄▄██ ▒██▄█▓▒ ▒▓▓█  ░██░▒██    ▒██ 
        ▒██████▒▒░██░░▒█░   ░██████▒▓█   ▓██▒▒██▒ ░  ░▒▒█████▓ ▒██▒   ░██▒
        ▒ ▒▓▒ ▒ ░░▓   ▒ ░   ░ ▒░▓  ░▒▒   ▓▒█░▒▓▒░ ░  ░░▒▓▒ ▒ ▒ ░ ▒░   ░  ░
        ░ ░▒  ░ ░ ▒ ░ ░     ░ ░ ▒  ░ ▒   ▒▒ ░░▒ ░     ░░▒░ ░ ░ ░  ░      ░
        ░  ░  ░   ▒ ░ ░ ░     ░ ░    ░   ▒   ░░        ░░░ ░ ░ ░      ░   
              ░   ░             ░  ░     ░  ░            ░            ░   
        `));
        console.log(chalk.green.bold('Chat Server v1.0'));
        console.log(chalk.yellow(`Listening on port ${PORT}`));
        console.log(chalk.gray('----------------------------'));
        
        this.server = net.createServer(this.handleConnection.bind(this));
        
        this.server.listen(PORT, () => {
            console.log(chalk.green.bold('Server is now running!'));
            console.log(chalk.gray('----------------------------'));
        });
    }

    handleConnection(socket) {
        const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
        console.log(chalk.blue(`\n[+] New connection from ${clientId}`));
        
        socket.setEncoding('utf8');
        socket.write('Please enter your username: ');
        
        socket.once('data', (username) => {
            username = username.toString().trim();
            this.clients.set(socket, username);
            
            console.log(chalk.green(`[✔] ${username} registered (${clientId})`));
            
            // Welcome message with last 10 messages
            const welcomeMsg = [
                '',
                chalk.yellow.bold(`Welcome ${username}!`),
                chalk.gray('----------------------------------'),
                chalk.bold('Recent messages:'),
                ...this.messageHistory.slice(-10).map(msg => chalk.gray(msg)),
                chalk.gray('----------------------------------'),
                ''
            ].join('\n');
            
            socket.write(welcomeMsg);
            
            // Broadcast join notification
            const joinMsg = `${new Date().toLocaleTimeString()} - ${username} joined the chat`;
            this.broadcast(joinMsg, null);
            this.addToHistory(joinMsg);
            console.log(chalk.magenta(`[→] ${username} joined the chat`));
            
            // Message handler
            socket.on('data', (data) => {
                const message = data.toString().trim();
                if (message) {
                    const timestamp = new Date().toLocaleTimeString();
                    const fullMsg = `${timestamp} - ${username}: ${message}`;
                    
                    // Log to server console with different colors for different users
                    const userColor = this.getUserColor(username);
                    console.log(
                        chalk.gray(`[${timestamp}] `) + 
                        chalk[userColor].bold(`${username}: `) + 
                        message
                    );
                    
                    this.broadcast(fullMsg, socket);
                    this.addToHistory(fullMsg);
                }
            });
            
            // Disconnection handler
            socket.on('end', () => {
                const leaveMsg = `${new Date().toLocaleTimeString()} - ${username} left the chat`;
                this.broadcast(leaveMsg, null);
                this.addToHistory(leaveMsg);
                this.clients.delete(socket);
                console.log(chalk.yellow(`[←] ${username} disconnected`));
            });
            
            socket.on('error', (err) => {
                console.error(chalk.red(`[!] Error with ${username}:`), err);
                this.clients.delete(socket);
            });
        });
    }

    getUserColor(username) {
        // Assign consistent color based on username hash
        const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];
        const hash = username.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        return colors[hash % colors.length];
    }

    broadcast(message, sender) {
        this.clients.forEach((_, client) => {
            if (client !== sender) {
                client.write(`${message}\n`);
            }
        });
    }

    addToHistory(message) {
        this.messageHistory.push(message);
        if (this.messageHistory.length > 100) {
            this.messageHistory.shift();
        }
    }
}

// Check for required package
try {
    require.resolve('chalk');
} catch(e) {
    console.error(chalk.red('[!] Please install chalk first: npm install chalk'));
    process.exit(1);
}

new ChatServer();
