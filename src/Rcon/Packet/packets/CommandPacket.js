const ServerClientPacket = require("./ServerClientPacket.js");

class CommandPacket extends ServerClientPacket {
  constructor() {
    super();
    
    this._init();
  }
  
  _init() {
    this.setType(this.getConfig().Command);
  }
  
  _encodePayload() {
    this.writeString(this.getPayload(), "ascii");
    this.writeShort(0);
  }
}

module.exports = CommandPacket;