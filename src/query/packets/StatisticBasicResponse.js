"use strict";

const Packet = require("./Packet.js");

class StatisticBasicResponse extends Packet {
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
    
    this.payload.MOTD = payload[0];
    this.payload.gametype = payload[1];
    this.payload.map = payload[2];
    this.payload.numPlayers = payload[3];
    this.payload.maxPlayers = payload[4];
    this.payload.hostIP = payload[5];
    this.payload.hostPort = payload[6];
  }
};

module.exports = StatisticBasicResponse;