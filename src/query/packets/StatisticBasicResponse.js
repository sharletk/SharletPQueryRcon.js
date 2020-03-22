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
    this.payload = {};
    
    this.payload.MOTD = this.parseString();
    this.payload.gametype = this.parseString();
    this.payload.map = this.parseString();
    this.payload.numPlayers = this.parseString();
    this.payload.maxPlayers = this.parseString();
    this.payload.hostPort = this.readLShort();
    this.payload.hostIP = this.parseString();
  }
};

module.exports = StatisticBasicResponse;