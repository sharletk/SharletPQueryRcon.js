"use strict";

const Packet = require("./Packet.js");

class Command extends Packet {
  constructor() {
    super();
    
    this.requestID = this.writeRequestID();
    this.type = this.RCONConfig.COMMAND;
  }
};

module.exports = Command;