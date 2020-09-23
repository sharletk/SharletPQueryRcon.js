const ServerClientPacket = require("./ServerClientPacket.js");

class ResponsePacket extends ServerClientPacket {
  constructor() {
    super();
  }
  
  _decodePayload() {
    this.setType(this.readByte());
    this.setSessionID(this.readInt());
    this.setToken(this.readString());
  }
}

module.exports = ResponsePacket;