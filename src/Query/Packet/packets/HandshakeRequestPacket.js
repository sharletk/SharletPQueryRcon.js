const ClientServerPacket = require("./ClientServerPacket.js");

class HandshakeRequestPacket extends ClientServerPacket {
  constructor() {
    super(); 
    
    this.setType(this.getConfig().Handshake);       
  }
}

module.exports = HandshakeRequestPacket;