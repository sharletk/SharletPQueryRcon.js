const ServerClientPacket = require("./ServerClientPacket.js");

class BasicResponsePacket extends ServerClientPacket {
  constructor() {
    super();
  }
  
  _decodePayload() {
    this.setType(this.readByte());
    this.setSessionID(this.readInt());
    console.log(this.getBuffer());
  }
}

module.exports = BasicResponsePacket;