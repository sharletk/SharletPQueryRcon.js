"use script";

const Socket = require("./Socket.js");

class SocketInstanceManager {
  constructor() {
    this.instances = new Map();
  }
  
  async createSocket(bindAddress) {
    const socket = new Socket();
    
    await socket._setBindAddress(bindAddress);
    
    await this.instances.set(socket.getSocketID(), socket);
    
    return socket;    
  }
}

module.exports = SocketInstanceManager;