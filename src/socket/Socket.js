"use strict";

const net = require("net");

class Socket {
  constructor() {    
    this._id = this._setSocketID();
    this._socket = null;
    this._ready = false;
    
    this._bindAddress = null;
  }
  
  getAddress() {
    return this._socket.address();
  }
  
  _isEeady() {
    if (!(this._isDestroyed())) {
      this._ready = true;
    }
    
    return this._ready;
  }
  
  _setEncoding(encoding) {
    this._socket.setEncoding(encoding);
  }
  
  getSocketID() {
    return this._id;
  }
  
  _setSocketID(id) {
    const min = -2147483648;
    const max = 2147483647;
    
    this._id = Math.floor(Math.random() * (max - min)) + min;
  }
  
  _getBindAddress() {
    return this._bindAddress;
  }
  
  _setBindAddress(bindAddress) {
    this._bindAddress = bindAddress;
  }
  
  _isPending() {
    return this._socket.pending;
  }
  
  _isDestroyed() {
    return this._socket.destroyed;
  }
  
  stats() {
    return {
      read: this._socket.bytesRead,
      write: this._socket.bytesWritten
    };
  } // TODO: Move to S.I.M
  
  _sockEvents() {
    this._socket.on("close", () => {
      console.warn(`Closed socket connection for @${this._bindAddress.host}:${this._bindAddress.port}.`);
    });
    
    this._socket.on("connect", () => {
      console.warn(`Connected to socket connection for @${this._bindAddress.host}:${this._bindAddress.port}.`);
    });
    
    this._socket.on("end", () => {
      console.log(`Half-Closed socket connection for @${this._bindAddress.host}:${this._bindAddress.port}.`);
    });
    
    this._socket.on("error", (error) => {
      console.error(error);
    });
    
    this._socket.on("ready", () => {
      console.log(`Socket connection ready for transmission on @${this._bindAddress.host}:${this._bindAddress.port}.`);
    });
    
    this._socket.on("timeout", () => {
      console.log(`Socket connection idling due to timeout for @${this._bindAddress.host}:${this._bindAddress.port}.`);
    });
  }
  
  async _connect() {
    const tcpSocket = new net.Socket();
    
    const host = this._bindAddress.host;
    const port = this._bindAddress.port;
             
    this._socket = await tcpSocket.connect(port, host, () => {
      console.log(`Connecting to @${host}:${port}`);
    });
  }
  
  async _close() {    
    await this._socket.destroy((error) => {
      throw new Error(error);
    });
    
    console.warn(`Closing socket connection for @${this._bindAddress.host}:${this._bindAddress.port}.`);
  }
  
  async _kill() {    
    this._socket.end("Socked Closed.", "utf8", () => {
      console.log(`Half-Closing socket connection for @${this._bindAddress.host}:${this._bindAddress.port}.`);
    });
  }
  
  _pause() {
    this._socket.pause();
    return console.log(`Paused socket data read for @${this._bindAddress.host}:${this._bindAddress.port}.`);
  }
  
  _resume() {
    this._socket.resume();
    return console.log(`Resumed socket data read for @${this._bindAddress.host}:${this._bindAddress.port}.`);
  }
  
  _setTimeout(timeout) {
    this._socket.setTimeout(timeout);
  }
}

module.exports = Socket;