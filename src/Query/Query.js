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
 *   @file Query.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const Socket = require("../Socket/UDP/Socket.js");
const BinaryStream = require("../BinaryStream/BinaryStream.js");

const EventEmitter = require("events");

class Query {
  constructor() {
    this._socket;
    this._packets = new Map();
    this._connected = false;
    this._statType;
    
    this._data = null;
    this._recieved = false;
    
    this._emitter = new EventEmitter();     
  }
  
  /**
   * Initialize all the required packets.
   *
   */
  
  _initializePackets() {
    const HandshakeRequestPacket = require("./Packet/packets/HandshakeRequestPacket.js");
    this._packets.set("HandshakeRequestPacket", new HandshakeRequestPacket());
    
    const HandshakeResponsePacket = require("./Packet/packets/HandshakeResponsePacket.js");
    this._packets.set("HandshakeResponsePacket", new HandshakeResponsePacket());
    
    const BasicRequestPacket = require("./Packet/packets/BasicRequestPacket.js");
    this._packets.set("BasicRequestPacket", new BasicRequestPacket());
    
    const BasicResponsePacket = require("./Packet/packets/BasicResponsePacket.js");
    this._packets.set("BasicResponsePacket", new BasicResponsePacket());
    
    const FullRequestPacket = require("./Packet/packets/FullRequestPacket.js");
    this._packets.set("FullRequestPacket", new FullRequestPacket());
    
    const FullResponsePacket = require("./Packet/packets/FullResponsePacket.js");
    this._packets.set("FullResponsePacket", new FullResponsePacket());
  }
  
  /**
   * Initialize the socket.
   *
   */
  
  async _init() {
    this._socket = await (new Socket());
    await this._socket.createSocket();
    
    this._socket.getSocket().on("message", (message, rinfo) => {
      this._dataParser(message, rinfo);
    });
  }
  
  /**
   * Connect to a remote address.
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
   * Disconnect from a remote address.
   *
   */
  
  async disconnect() {
    await this._socket.disconnect();
    this._connected = false;
  }
  
  /**
   * Destroy the socket.
   *
   */
  
  async destroy() {
    await this._socket.destroySocket();
    this._connected = false;
  }
  
  /**
   * Get the data.
   *
   * @return {object} data
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
   * Query a server.
   *
   * @param {string} statType
   */
    
  async execute(statType = "full") {    
    if (!(this._connected)) return console.error("[SharletPQueryRcon/Query] Please connect to a address.");
    
    await this._initializePackets();        
    
    if (statType !== "basic" && statType !== "full") statType = "full";
    
    this._statType = statType;    
    
    let HandshakeRequestPacket = this._packets.get("HandshakeRequestPacket");
    
    await HandshakeRequestPacket.setSessionID(HandshakeRequestPacket._generateSessionID());
    await HandshakeRequestPacket.encode();
    await this._socket.sendData(HandshakeRequestPacket.getBuffer());   
  }
  
  /**
   * Parse the incoming data from socket.
   *
   * @param {buffer} message
   * @param {object} rinfo
   * @return {*}
   */
  
  async _dataParser(message, rinfo) {
    let binstream = new BinaryStream();
    binstream.setBuffer(message);
    
    const type = binstream.readByte();
    if (type == 0x00) {
      if (this._statType == "basic") {
        let BasicResponsePacket = this._packets.get("BasicResponsePacket");
        
        await BasicResponsePacket.write(message);
        await BasicResponsePacket.rewind();
        await BasicResponsePacket.decode();
        
        let payload = await BasicResponsePacket.getPayload();
        
        this._data = {
          "motd": payload[0],
          "gametype": payload[1],
          "map": payload[2],
          "numplayers": payload[3],
          "maxplayers": payload[4],
          "hostport": payload[5],
          "hostip": payload[6]
        };
      } else if (this._statType == "full") {
        let FullResponsePacket = this._packets.get("FullResponsePacket");
        
        await FullResponsePacket.write(message);
        await FullResponsePacket.rewind();
        await FullResponsePacket.decode();
        
        let payload = await FullResponsePacket.getPayload();
        
        this._data = {
          "hostname": payload[1],
          "game_type": payload[3],
          "game_id": payload[5],
          "version": payload[7],
          "server_engine": payload[9],
          "plugins": payload[11],
          "map": payload[13],
          "numplayers": payload[15],
          "maxplayers": payload[17],
          "whitelist": payload[19],
          "players": payload[20]
        };
      } else {
        return;
      }
      
      await this._emitter.emit("data", this._data);
      await this.disconnect();
      this._recieved = true;
    } else if (type == 0x09) {
      let HandshakeResponsePacket = this._packets.get("HandshakeResponsePacket");
      
      await HandshakeResponsePacket.write(message);
      await HandshakeResponsePacket.rewind();
      await HandshakeResponsePacket.decode();
      
      let sessionID = await HandshakeResponsePacket.getSessionID();
      let token = await HandshakeResponsePacket.getToken();
      
      if (this._statType == "basic") {
        let BasicRequestPacket = this._packets.get("BasicRequestPacket");
      
        await BasicRequestPacket.setSessionID(sessionID);
        await BasicRequestPacket.setToken(token);
        await BasicRequestPacket.encode();
      
        await this._socket.sendData(BasicRequestPacket.getBuffer());
      } else if (this._statType == "full") {
        let FullRequestPacket = this._packets.get("FullRequestPacket");
      
        await FullRequestPacket.setSessionID(sessionID);
        await FullRequestPacket.setToken(token);
        await FullRequestPacket.encode();
      
        await this._socket.sendData(FullRequestPacket.getBuffer());
      } else {
        return;
      }            
    } else {
      return;
    }
  }
}

module.exports = Query;