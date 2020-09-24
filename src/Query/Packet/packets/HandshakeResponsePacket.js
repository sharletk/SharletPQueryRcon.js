const ServerClientPacket = require("./ServerClientPacket.js");

class HandshakeResponsePacket extends ServerClientPacket {
  constructor() {
    super();
  }
  
  _decodePayload() {
    this.setToken(this.readString().replace("\x00", ""));
  }
}

module.exports = HandshakeResponsePacket;