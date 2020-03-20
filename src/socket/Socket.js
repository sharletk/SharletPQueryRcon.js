"use strict";

const dgram = require("dgram");

class Socket {
  constructor(console) {
    this.console = console;
    
    this.socket;
    this.bindAddress;
  }
  
  getSocket() {
    return this.socket;
  }
  
  getBindAddress() {
    return this.bindAddress;
  }
  
  getAddress() {
    return this.socket.address();
  }
  
  getIP() {
    return this.getAddress().ip;
  }
  
  getPort() {
    return this.getAddress().port;
  }
  
  getRecvBufferSize() {
    return this.socket.getRecvBufferSize();
  }
  
  getSendBufferSize() {
    return this.socket.getSendBufferSize();
  }
  
  setRecvBufferSize(size) {
    this.socket.setRecvBufferSize(size);
  }
  
  setSendBufferSize(size) {
    this.socket.setSendBufferSize(size);
  }
  
  connect() {
    this.console.notice(`Connecting to socket with Address: ${this.bindAddress.address} | Port: ${this.bindAddress.port}..
    `);
    
    return this.socket.connect(this.bindAddress.port, this.bindAddress.address, (error) => {
      if (error) return this.console.error(error);      
    });
  }
  
  disconnect() {
    this.console.warning("Disconnecting from socket...");
    
    return this.socket.disconnect();
  }
  
  close() {
    this.console.warning("Closing socket...");
    
    return this.socket.close();
  }
  
  kill() {
    this.console.alert("Killing Socket...");
    this.disconnect();
    this.close();
  }
  
  setup(address) {    
    this.socket.on("connect", () => {
      this.console.log("Socket has successfully connected.");
    });
      
    this.socket.on("close", () => {
      this.console.alert("Socket has successfully disconnected.");
    });
      
    this.socket.on("listening", () => {
      this.console.notice(this.getAddress());
     });
      
    this.socket.on("message", (message, rinfo) => {
      this.console.info(message)
      this.console.info(rinfo);
    });
      
    this.socket.on("error", (error) => {
      this.console.error(error);
      this.close();
    });
    
    if (typeof address !== "undefined" && typeof address.address !== "undefined" && typeof address.port !== "undefined") {
      this.bindAddress = address;
    } else {
      this.console.error("Unable to bind to the requested socket due to incomplete data provided.");
      
      this.close();
    }
    
    this.socket = dgram.createSocket({
      type: "udp4"
    });
    
    this.socket.bind(this.bindAddress);
  }
};

module.exports = Socket;