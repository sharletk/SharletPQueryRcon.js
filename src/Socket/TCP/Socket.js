/**
 *
 *
 *
 * ╭━━━┳╮╱╱╱╱╱╱╭╮╱╱╱╭╮╭━━━╮
 * ┃╭━╮┃┃╱╱╱╱╱╱┃┃╱╱╭╯╰┫╭━╮┃
 * ┃╰━━┫╰━┳━━┳━┫┃╭━┻╮╭┫╰━╯┃
 * ╰━━╮┃╭╮┃╭╮┃╭┫┃┃┃━┫┃┃╭━━╯
 * ┃╰━╯┃┃┃┃╭╮┃┃┃╰┫┃━┫╰┫┃
 * ╰━━━┻╯╰┻╯╰┻╯╰━┻━━┻━┻╯
 *
 *
 *
 *  @author SharletP
 *   @file Socket.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const net = require("net");

class Socket {
  constructor() {
    this._socket;
  }
  
  /**
   * Return the socket.
   *
   * @return {object}
   */
  
  getSocket() {
    return this._socket;
  }
  
  /**
   * Set the socket.
   *
   * @param {*} socket
   */
  
  setSocket(socket) {
    this._socket = socket;
  }
  
  /**
   * Return the local bound address.
   *
   * @return {object}
   */
  
  getAddress() {
    return this._socket.address();
  }
  
  /**
   * Return the remote bound address.
   *
   * @return {object}
   */
  
  getRemoteAddress() {
    return {
      "port": this._socket.remotePort,
      "family": this._socket.remoteFamily,
      "address": this._socket.remoteAddress
    }
  }
  
  /**
   * Create a new socket.
   *
   */
  
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
  
  /**
   * Destroy a socket.
   *
   */
  
  async destroySocket() {
    await this._socket.destroy();
  }
  
  /**
   * Return the buffer size.
   *
   * @return {number}
   */
  
  getBufferSize() {
    return this._socket.bufferSize;
  }
  
  /**
   * Return the amount of bytes read.
   *
   * @return {number}
   */
  
  getBytesRead() {
    return this._socket.bytesRead;
  }
  
  /**
   * Return the amount of bytes written.
   *
   * @return {number}
   */
  
  getBytesWritten() {
    return this._socket.bytesWritten;
  }
  
  /**
   * Connect to a address.
   *
   * @param {number} port
   * @param {string} address
   */
  
  async connect(port, address) {
    await this._socket.connect(port, address);
  }
  
  /**
   * Disconnect from the address.
   *
   */
  
  async disconnect() {
    await this._socket.end();
  }
  
  /**
   * Return the connecting socket status.
   *
   * @return {bool}
   */
  
  _connecting() {
    return this._socket.connecting;
  }
  
  /**
   * Return the destroyed socket status.
   *
   * @return {bool}
   */
  
  _destroyed() {
    return this._socket.destroyed;
  }
  
  /**
   * Return the pending socket status.
   *
   * @return {bool}
   */
  
  _pending() {
    return this._socket.pending;
  }
  
  /**
   * Pause the data drain.
   *
   */
  
  pauseStream() {
    this._socket.pause();
  }
  
  /**
   * Resume the data drain.
   *
   */
  
  resumeStream() {
    this._socket.resume();
  }
  
  /**
   * Set an encoding scheme.
   *
   * @param {string} encoding
   */
  
  setEncoding(encoding) {
    this._socket.setEncoding(encoding);
  }
  
  /**
   * Send data through the socket.
   *
   * @param {buffer} buf
   * @param {string} encoding
   */
  
  async sendData(buf, encoding = "utf8") {
    await this._socket.write(buf, encoding);
  }
}

module.exports = Socket;