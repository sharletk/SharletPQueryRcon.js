"use strict";

const Packet = require("./Packet.js");

class HandshakeRequest extends Packet {
  constructor() {
    super();
  }
  
  encodeHeader() {
    this.writeShort(this.QueryConfig.MAGIC);
    this.writeByte(this.QueryConfig.HANDSHAKE);
    this.writeInt(this.writeSessionID());
  }
  
  encodePayload() {
    // Empty
  }
};

module.exports = HandshakeRequest;