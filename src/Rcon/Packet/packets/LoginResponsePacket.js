const ServerClientPacket = require("./ServerClientPacket.js");

class LoginResponsePacket extends ServerClientPacket {
  constructor() {
    super();
  }
  
  _decodePayload() {
    this.readShort();
  }
}

module.exports = LoginResponsePacket;