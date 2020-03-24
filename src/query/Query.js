"use strict";

const BinaryStream = require("../binarystream/BinaryStream.js");
const Socket = require("../socket/Socket.js");

class Query {
  constructor(console) {
    this.console = console;
    
    this.socket = new Socket(console);
    
    this.packetPool = new Map();
    this.loadPackets();
    
    this.socket.setup();
    this.type = "full";
    
    this.socket.getSocket().on("message", (message, rinfo) => {
      this.handle(message, this.type);
    });
    
    this.StatisticResponsePacket;
  }
  
  getType() {
    return this.type;
  }
  
  setType(type) {
    this.type = type;
  }
  
  loadPackets() {    
    this.packetPool.set("HandshakeRequest", require("./packets/HandshakeRequest.js"));
    this.packetPool.set("HandshakeResponse", require("./packets/HandshakeResponse.js"));
    
    this.packetPool.set("StatisticBasicRequest", require("./packets/StatisticBasicRequest.js"));
    this.packetPool.set("StatisticBasicResponse", require("./packets/StatisticBasicResponse.js"));
    
    this.packetPool.set("StatisticFullRequest", require("./packets/StatisticFullRequest.js"));
    
    this.packetPool.set("StatisticFullResponse", require("./packets/StatisticFullResponse.js"));
  }
  
  query(address, port) {
    if (typeof address === "undefined" && typeof port === "undefined") return this.console.error("Error during query request, sufficient data not supplied to complete process.");
    
    this.socket.connect({
      "address": address,
      "port": port
    });
    
    let HandshakeRequestPacket = this.packetPool.get("HandshakeRequest");
    HandshakeRequestPacket = new HandshakeRequestPacket();
    
    HandshakeRequestPacket.encode();
    
    console.log(HandshakeRequestPacket)
     
    this.socket.writePacket(HandshakeRequestPacket);
  }
  
  async handle(message) {
    let buffer = new BinaryStream();
    buffer.writeData(message);
    buffer.setOffset(0);
    
    let messageType = buffer.readByte();
    
    if (messageType === 0x09) {
      let HandshakeResponsePacket = this.packetPool.get("HandshakeResponse");
      HandshakeResponsePacket = new HandshakeResponsePacket();
      
      HandshakeResponsePacket.writeData(message);
      
      HandshakeResponsePacket.decode();
      
      console.log(HandshakeResponsePacket)
      
      let sessionID = HandshakeResponsePacket.sessionID;
      let payload = HandshakeResponsePacket.payload;
      
      this.handleStatisticSend(sessionID, payload)
    } else {
      this.handleStatisticRecv(message);
    }
  }
  
  handleStatisticRecv(message) {
    if (this.type === "basic") {
      let StatisticBasicResponsePacket = this.packetPool.get("StatisticBasicResponse");
      StatisticBasicResponsePacket = new StatisticBasicResponsePacket();
      
      StatisticBasicResponsePacket.writeData(message);
      StatisticBasicResponsePacket.decode();
      
      console.log(StatisticBasicResponsePacket);
      
      this.StatisticResponsePacket = StatisticBasicResponsePacket.payload;
    } else {
      let StatisticFullResponsePacket = this.packetPool.get("StatisticFullResponse");
      StatisticFullResponsePacket = new StatisticFullResponsePacket();
      
      StatisticFullResponsePacket.writeData(message);
      StatisticFullResponsePacket.decode();
      
      console.log(StatisticFullResponsePacket);
      
      this.StatisticResponsePacket = StatisticFullResponsePacket.payload;
    }
  }
  
  handleStatisticSend(sessionID, payload) {
    if (this.type === "basic") {
      let StatisticBasicRequest = this.packetPool.get("StatisticBasicRequest");
      StatisticBasicRequest = new StatisticBasicRequest();
      StatisticBasicRequest.sessionID = sessionID;
      StatisticBasicRequest.payload = payload;
      
      StatisticBasicRequest.encode();
      
      console.log(StatisticBasicRequest)
      
      this.socket.writePacket(StatisticBasicRequest);
    } else {
      let StatisticFullRequest = this.packetPool.get("StatisticFullRequest");
      StatisticFullRequest = new StatisticFullRequest();
      
      StatisticFullRequest.sessionID = sessionID;
      StatisticFullRequest.payload = payload;
      
      StatisticFullRequest.encode();
      
      console.log(StatisticFullRequest)
      
      this.socket.writePacket(StatisticFullRequest);
    }
  }
};

module.exports = Query;