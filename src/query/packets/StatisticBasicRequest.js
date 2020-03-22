"use strict";

const Packet = require("./Packet.js");

class StatisticBasicRequest extends Packet {
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
  }
};

module.exports = StatisticBasicRequest;