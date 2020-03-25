"use strict";

const Packet = require("./Packet.js");

class StatisticFullResponse extends Packet {
  constructor() {
    super();
    
    this.sessionID;
    this.payload;
  }
  
  decodeHeader() {
    this.readByte();
    this.sessionID = this.readInt();
  }
  
  decodePayload() {
    let payload = "";
    
    let length;
    for (length = this.getOffset(); length <= this.length; length) {
      console.log(length);
      if (this.feof()) break;
      let data = this.parseString();
      length = this.getOffset();
      payload += data;
    }
    
    payload = payload.split("\u0000");
    
    this.payload = {};
    
    this.payload.hostname = payload[3];
    this.payload.gametype = payload[5];
    this.payload.gameID = payload[7];
    this.payload.version = payload[9];
    this.payload.server_engine = payload[11];
    this.payload.plugins = payload[13];
    this.payload.map = payload[15];
    this.payload.numPlayers = payload[17];
    this.payload.maxPlayers = payload[19];
    this.payload.whitelist = payload[21];
    this.payload.hostIP = payload[23];
    this.payload.hostPort = payload[25];
    
    this.payload.players = payload.slice(28).filter(n => n.length > 0);
  }
};

module.exports = StatisticFullResponse;