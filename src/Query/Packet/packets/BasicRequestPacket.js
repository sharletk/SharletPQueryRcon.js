const ClientServerPacket = require("./ClientServerPacket.js");

class BasicRequestPacket extends ClientServerPacket {
  constructor() {
    super();
    
    this.setType(this.getConfig().Statistics)
  }
  
  _encodePayload() {
    this.writeInt(this.getToken());
  }
}

module.exports = BasicRequestPacket;