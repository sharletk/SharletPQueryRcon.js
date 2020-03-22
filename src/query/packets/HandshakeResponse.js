"use strict";

const Packet = require("./Packet.js");

class HandshakeResponse extends Packet {
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
    this.payload = this.readString().toString().replace("\u0000", "");
  }
};

module.exports = HandshakeResponse;