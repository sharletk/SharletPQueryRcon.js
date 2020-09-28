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
 *   @file Rcon.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const Socket = require("../Socket/TCP/Socket.js");
const BinaryStream = require("../BinaryStream/BinaryStream.js");

const EventEmitter = require("events");

class Rcon {
  constructor() {
    this._socket;
    this._packets = new Map();
    this._connected = false;
    
    this._loggedIn = false;
    
    this._data = null;
    this._recieved = false;        
    
    this.__password;
    this._command;
    
    this._emitter = new EventEmitter();
  }
  
  /**
   * Initialize packets.
   *
   */
  
  _initializePackets() {
    const LoginPacket = require("./Packet/packets/LoginPacket.js");
    this._packets.set("LoginPacket", new LoginPacket());
    
    const LoginResponsePacket = require("./Packet/packets/LoginResponsePacket.js");
    this._packets.set("LoginResponsePacket", new LoginResponsePacket());
    
    const CommandPacket = require("./Packet/packets/CommandPacket.js");
    this._packets.set("CommandPacket", new CommandPacket());
    
    const CommandResponsePacket = require("./Packet/packets/CommandResponsePacket.js");
    this._packets.set("CommandResponsePacket", new CommandResponsePacket());
  }
  
  /**
   * Initialize the socket.
   *
   */
  
  async _init() {
    this._socket = await (new Socket());
    await this._socket.createSocket();
    
    this._socket.getSocket().on("data", (data) => {
      this._dataParser(data);
    });
  }
  
  /**
   * Connect to a address.
   *
   * @param {number} port
   * @param {string} address
   */
  
  async connect(port, address) {    
    return new Promise(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
      try {
        await this._init();
        await this._socket.connect(port, address).then((sock) => {
          this._connected = true;      
          
          setTimeout(() => resolve(this), 1000);    
        }).catch(error => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Disconnect from a address.
   *
   */
  
  async disconnect() {
    await this._socket.disconnect();
    this._connected = false;
  }
  
  /**
   * Destroy thr socket.
   *
   */
  
  async destroy() {
    await this._socket.destroySocket();
    this._connected = false;
  }
  
  /**
   * Set the RCON Server Password
   *
   * @param {string} password
   */
  
  setPassword(password) {
    this.__password = password;
  }
  
  /**
   * Get the stored RCON Server Command
   *
   * @return {string}
   */
  
  getCommand() {
    return this._command;
  }
  
  /**
   * Set the stored RCON Server Command
   *
   * @param {string} command
   */
  
  setCommand(command) {
    this._command = command;
  }
  
  /**
   * Get the data recieved back from the RCON Server.
   *
   * @return {string}
   */
  
  getData() {
    return this._data;
  }
  
  /**
   * Get the Event Emitter.
   *
   * @return {*}
   */
   
  getEmitter() {
    return this._emitter;
  }
  
  /**
   * Execute the command
   *
   */
  
  async execute() {  
    if (!(this._connected)) return console.error("[SharletPQueryRcon/Query] Please connect to a address.");
    
    await this._initializePackets();
    
    let LoginPacket = this._packets.get("LoginPacket");
    
    await LoginPacket.setRequestID(LoginPacket._generateRequestID());
    await LoginPacket.setPayload(this.__password);  
    await LoginPacket.encode();
    await this._socket.sendData(LoginPacket.getBuffer());
  }
  
  /**
   * Parse the data recieved by the socket.
   *
   * @param {buffer} data
   */
  
  async _dataParser(data) {
    let binstream = new BinaryStream();
    binstream.setBuffer(data);
    
    binstream.setOffset(8);
    const type = binstream.readLInt();
    
    if (type == 0x02) {
      let LoginResponsePacket = this._packets.get("LoginResponsePacket");
      
      await LoginResponsePacket.setBuffer(data);
      await LoginResponsePacket.decode();
      
      let requestID = await LoginResponsePacket.getRequestID();
      
      if (requestID == -1) return console.error("[SharletPQueryRcon/Rcon] Authentication Failed.");
      
      let CommandPacket = this._packets.get("CommandPacket");
      
      await CommandPacket.setRequestID(requestID);
      await CommandPacket.setPayload(this._command);
      await CommandPacket.encode();          
      await this._socket.sendData(CommandPacket.getBuffer());      
    } else if (type == 0x00) {
      let CommandResponsePacket = this._packets.get("CommandResponsePacket");
      
      await CommandResponsePacket.setBuffer(data);
      await CommandResponsePacket.decode();
      
      this._data = await CommandResponsePacket.getPayload();
      
      await this._emitter.emit("data", this._data);
      await this.disconnect();
      this._recieved = true;
    } else {
      return;
    }
  }
}

module.exports = Rcon;