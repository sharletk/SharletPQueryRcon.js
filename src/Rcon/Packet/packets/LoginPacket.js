const ClientServerPacket = require("./ClientServerPacket.js");

class LoginPacket extends ClientServerPacket {
  constructor() {
    super();
    
    this._init();
  }
  
  _init() {
    this.setType(this.getConfig().Login);
  }
  
  _encodePayload() {
    this.writeString(this.getPayload(), "ascii");
    this.writeLShort(0);
  }
}

module.exports = LoginPacket;