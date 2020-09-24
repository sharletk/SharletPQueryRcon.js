const ClientServerPacket = require("./ClientServerPacket.js");

class FullRequestPacket extends ClientServerPacket {
  constructor() {
    super();
    
    this.setType(this.getConfig().Statistics)
  }
  
  _encodePayload() {
    this.writeInt(this.getToken());
    this.writeInt(0);
  }
}

module.exports = FullRequestPacket;