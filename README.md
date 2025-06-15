# Real-Time Chat Application 🚀

## 📌 Overview
A Node.js-based real-time chat application using TCP sockets that allows multiple clients to communicate simultaneously. Features include username registration, message history, and server-side monitoring.

## ✨ Features

### Server
- 🖥️ Color-coded console output
- 📝 Message history (last 100 messages)
- 👥 User connection tracking
- ⏱️ Timestamped messages
- 🔔 Join/leave notifications

### Client
- ✏️ Username registration
- 📜 View last 10 messages upon joining
- 💬 Real-time messaging
- 🎨 Colored interface
- 🌐 Configurable server connection

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mithleshprasad/backend_development.git
   cd backend_development
   ```

2. Install dependencies:
   ```bash
   npm install chalk@4 colors
   ```

## 🏃‍♂️ How to Run

### Start the Server
```bash
node server.js
```

### Start Clients (in separate terminals)
```bash
node client.js
```
Follow the prompts to:
1. Enter server IP (press Enter for localhost)
2. Enter port (press Enter for 3000)
3. Choose a username

## 🖥️ Server Console Features
- Displays ASCII art banner on startup
- Shows all connection attempts with IP/port
- Logs all messages with timestamps and usernames
- Color-codes different users' messages
- Tracks disconnections

## 👤 Client Interface
- Simple text-based interface
- Clear separation of messages
- Real-time updates
- Connection status notifications

## 🛠️ Technical Stack
- **Node.js** - Runtime environment
- **net module** - TCP socket communication
- **chalk@4** - Server console styling
- **colors** - Client console styling

## 🐛 Troubleshooting

### Common Issues
1. **Port in use**:
   ```bash
   lsof -i :3000  # Find process using port
   kill -9 <PID>  # Replace <PID> with process ID
   ```

2. **Connection issues**:
   - Verify server is running
   - Check firewall settings
   - Use correct IP address for remote connections

## 📜 License
MIT License - Free for personal and commercial use
