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
      this.console.error("Unable to bind to the requested socket due to incomplete data provided.");
      
      this.close();
    }
        
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
  
  setup(port) {   
    this.socket = dgram.createSocket({
      type: "udp4"
    });
        
    this.socket.on("connect", () => {
      this.console.log("Socket has successfully connected.");
    });
      
    this.socket.on("close", () => {
      this.console.alert("Socket has successfully disconnected.");
    });
      
    this.socket.on("listening", () => {
      this.console.notice(this.getAddress());
      
      this.setRecvSize(500);
      this.setSendSize(500);
     });
      
    this.socket.on("message", (message, rinfo) => {
      this.console.info(message)
      this.console.info(rinfo);
    });
      
    this.socket.on("error", (error) => {
      this.console.error(error);
      this.close();
    });
        
    if (typeof port === "undefined") {
      this.socket.bind();
    } else {
      this.socket.bind(port);
    }        
  }
  
  writePacket(message) {
    this.socket.send(message.buffer, 0, message.buffer.length, (error) => {
      if (error) return this.console.error(error);
      
      this.console.debug("Successfully send packet through socket.");
    });
  }
};

module.exports = Socket;