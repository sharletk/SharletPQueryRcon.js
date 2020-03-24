"use strict";

const Packet = require("./Packet.js");

class CommandResponse extends Packet {
  constructor() {
    super();
    
    this.requestID = this.writeRequestID();
    this.type = this.RCONConfig.COMMAND_RESPONSE;
    
    this.payload;
  }
  
  decodePayload() {
    
  }
};

module.exports = CommandResponse;