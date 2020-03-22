"use strict";

const Packet = require("./Packet.js");

class StatisticFullRequest extends Packet {
  constructor() {
    super();
    
    this.sessionID;
    this.payload;
  }
  
  encodeHeader() {
    this.writeShort(this.QueryConfig.MAGIC);
    this.writeByte(this.QueryConfig.STATISTIC);
    this.writeInt(this.sessionID);
  }
  
  encodePayload() {
    this.writeInt(this.payload);
    this.writeInt(0);
  }
};

module.exports = StatisticFullRequest;