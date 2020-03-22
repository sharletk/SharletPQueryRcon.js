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
    let payload = this.readString().toString().replace("\u0000", "");
    
    let buffer = Buffer.alloc(4);
    buffer.writeUInt32BE(payload, 0);
    
    this.payload = buffer;
  }
};

module.exports = HandshakeResponse;