const ServerClientPacket = require("./ServerClientPacket.js");

class CommandResponsePacket extends ServerClientPacket {
  constructor() {
    super();
  }
  
  _decodePayload() {
    this.setPayload(this.readString("ascii").replace("\x00", ""));
    this.readByte();
  }
}

module.exports = CommandResponsePacket;