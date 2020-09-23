const ClientServerPacket = require("./ClientServerPacket.js");

class BasicRequestPacket extends ClientServerPacket {
  constructor() {
    super();
  }
  
  _encodePayload() {
    this.writeInt(this.getToken);
  }
}

module.exports = BasicRequestPacket;