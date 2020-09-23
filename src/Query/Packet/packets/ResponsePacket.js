const ServerClientPacket = require("./ServerClientPacket.js");

class ResponsePacket extends ServerClientPacket {
  constructor() {
    super();
  }
  
  _decodePayload() {
    this.setToken(this.readString().replace("\x00", ""));
  }
}

module.exports = ResponsePacket;