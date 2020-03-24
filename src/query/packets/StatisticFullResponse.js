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
    // Figure out way to effectively parse data.
    
    let payloadA = this.readString().toString();
    let payloadB = this.readString().toString();
    let payloadC = this.readString().toString();
    this.payload = {};
    
    let parsedDataA = payloadA.split("\u0000");
    let parsedDataB = payloadB.split("\u0000");
    let parsedDataC = payloadC.split("\u0000");
    
    console.log(parsedDataA);
    console.log(parsedDataB);
    console.log(parsedDataC);
    
    /*this.readData(11);
    
    this.payload.hostname = this.parseString();
    this.payload.gametype = this.parseString();
    this.payload.gameID = this.parseString();
    this.payload.version = this.parseString();
    this.payload.plugins = this.parseString();
    this.payload.map = this.parseString();
    this.payload.numPlayers = this.parseString();
    this.payload.maxPlayers = this.parseString();
    this.payload.hostPort = this.readLShort();
    this.payload.hostIP = this.parseString();
    
    this.readData(10);
    
    this.payload.players = [];
    for (let i = this.getOffset(); i < this.length; i = this.getOffset()) {
      this.payload.players.push(this.parseString());
    };*/
  }
};

module.exports = StatisticFullResponse;