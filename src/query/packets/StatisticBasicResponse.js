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
    let payload = this.readString().toString();
    this.payload = {};
    
    let parsedData = payload.split("\u0000");
    
    this.payload.MOTD = parsedData[0];
    this.payload.gametype = parsedData[1];
    this.payload.map = parsedData[2];
    this.payload.numPlayers = parsedData[3];
    this.payload.maxPlayers = parsedData[4];
    
    // Need to do some fix on this, do not use until further notice.
    this.payload.hostPort = parsedData[5];
    this.payload.hostIP = parsedData[6];
  }
};

module.exports = StatisticBasicResponse;