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

const dgram = require("dgram");

class Socket {
  constructor() {
    this._socket;
  }
  
  /**
   * Returns the socket.
   *
   * @return {object}
   */
  
  getSocket() {
    return this._socket;
  }
  
  /**
   * Returns the local bound address.
   *
   * @return {object}
   */
  
  getAddress() {
    return this._socket.address();
  }
  
  /**
   * Returns remote bound address.
   *
   * @return {object}
   */
  
  getRemoteAddress() {
    return this._socket.remoteAddress();
  }
  
  /**
   * Create a new socket.
   */
  
  async createSocket() {
    this._socket = await dgram.createSocket("udp4");
    
    this._socket.on("error", (error) => {
      console.error(`[SharletPQueryRcon/UDP/Socket] ${error}`);
      this._socket.close();
    });
    
    this._socket.on("listening", () => {
      let address = this._socket.address();
      console.info(`[SharletPQueryRcon/UDP/Socket] Listening on ${address.address}:${address.port} [${address.family}]`);
    });
    
    this._socket.on("connect", () => {
      console.debug("[SharletPQueryRcon/UDP/Socket] Successfull socket connection established to the address.");
    });
    
    this._socket.on("disconnect", () => {
      console.warn("[SharletPQueryRcon/UDP/Socket] Successfull socket disconnect from the address.");
    });
  }
  
  /**
   * Destroy a socket.
   *
   * @return {object}
   */
  
  async destroySocket() {    
    return this._socket.close();
  }
  
  /**
   * Connect to a remote address.
   *
   * @param {number} port
   * @param {string} address
   */
  
  async connect(port, address) {    
    await this._socket.connect(port, address);
  }
  
  /**
   * Disconnect from a remote address.
   *
   */
  
  async disconnect() {    
    await this._socket.disconnect();
  }  
  
  /**
   * Send data through the socket.
   *
   * @param {buffer} buffer
   * @return {*}
   */
  
  async sendData(buffer) {    
    return this._socket.send(buffer, this.getRemoteAddress().port, this.getRemoteAddress().address);
  }
}

module.exports = Socket;