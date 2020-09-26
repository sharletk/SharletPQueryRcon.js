const net = require("net");

class Socket {
  constructor() {
    this._socket;
  }
  
  getSocket() {
    return this._socket;
  }
  
  setSocket(socket) {
    this._socket = socket;
  }
  
  getAddress() {
    return this._socket.address();
  }
  
  getRemoteAddress() {
    return {
      "port": this._socket.remotePort,
      "family": this._socket.remoteFamily,
      "address": this._socket.remoteAddress
    }
  }
  
  async createSocket() {
    this._socket = await net.Socket();
    
    this._socket.on("close", (error) => {
      if (error) console.error("Socket was closed due to transmission error.");
      
      console.log("Socket successfully closed.");
    });
    
    this._socket.on("connect", () => {
      console.log("Successful socket connection established.");
    });
    
    this._socket.on("drain", () => {
      console.debug("Write buffer has been drained.");
    });
    
    this._socket.on("end", () => {
      console.warn("The connected address has closed the session.");
    });
    
    this._socket.on("error", (error) => {
      console.error(error);
    });
    
    this._socket.on("ready", () => {
      console.info("Socket is ready to be used.");
    });
    
    this._socket.on("timeout", () => {
      console.warn("Socket has timedout.");
    });
  }
  
  async destroySocket() {
    await this._socket.destroy();
  }
  
  getBufferSize() {
    return this._socket.bufferSize;
  }
  
  getBytesRead() {
    return this._socket.bytesRead;
  }
  
  getBytesWritten() {
    return this._socket.bytesWritten;
  }
  
  async connect(port, address) {
    await this._socket.connect(port, address);
  }
  
  async disconnect() {
    await this._socket.end();
  }
  
  _connecting() {
    return this._socket.connecting;
  }
  
  _destroyed() {
    return this._socket.destroyed;
  }
  
  _pending() {
    return this._socket.pending;
  }
  
  pauseStream() {
    this._socket.pause();
  }
  
  resumeStream() {
    this._socket.resume();
  }
  
  setEncoding(encoding) {
    this._socket.setEncoding(encoding);
  }
  
  async sendData(buf, encoding = "utf8") {
    await this._socket.write(buf, encoding);
  }
}

module.exports = Socket;