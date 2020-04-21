"use strict";

const dgram = require("dgram");

class Socket {
  constructor() {
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
  
  getRecvSize() {
    return this.socket.getRecvBufferSize();
  }
  
  getSendSize() {
    return this.socket.getSendBufferSize();
  }
  
  setRecvSize(size) {
    this.socket.setRecvBufferSize(size);
  }
  
  setSendSize(size) {
    this.socket.setSendBufferSize(size);
  }
  
  connect(address) {
    if (typeof address !== "undefined" && typeof address.address !== "undefined" && typeof address.port !== "undefined") {
      this.bindAddress = address;
    } else {
      console.error("Unable to bind to the requested socket due to incomplete data provided.");
      
      this.close();
    }
            
    /*console.log(`Connecting to socket with Address: ${this.bindAddress.address} | Port: ${this.bindAddress.port}..
    `);
    
    return this.socket.connect(this.bindAddress.port, this.bindAddress.address, (error) => {
      if (error) return this.console.error(error);      
    });*/
  }
  
  disconnect() {
    console.warn("Disconnecting from socket...");
    
    return this.socket.disconnect();
  }
  
  close() {
    console.warn("Closing socket...");
    
    return this.socket.close();
  }
  
  kill() {
    console.alert("Killing Socket...");
    this.disconnect();
    this.close();
  }
  
  setup(socketPort) {       
    this.socket = dgram.createSocket({
      type: "udp4"
    });
        
    this.socket.on("connect", () => {
      console.log("Socket has successfully connected.");
    });
      
    this.socket.on("close", () => {
      console.alert("Socket has successfully disconnected.");
    });
      
    this.socket.on("listening", () => {
      console.log(this.getAddress());
      
      this.setRecvSize(500);
      this.setSendSize(500);
     });
      
    this.socket.on("message", (message, rinfo) => {
      console.info(message)
      console.info(rinfo);
    });
      
    this.socket.on("error", (error) => {
      console.error(error);
      this.close();
    });
        
    if (typeof socketPort === "undefined") {
      this.socket.bind();
    } else {
      this.socket.bind(socketPort);
    }        
  }
  
  writePacket(message) {
    this.socket.send(message.buffer, 0, message.buffer.length, this.bindAddress.port, this.bindAddress.address, (error) => {
      if (error) return this.console.error(error);
      
      console.debug("Successfully send packet through socket.");
    });
  }
};

module.exports = Socket;