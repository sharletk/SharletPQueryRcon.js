const ClientServerPacket = require("./ClientServerPacket.js");

class RequestPacket extends ClientServerPacket {
  constructor() {
    super(); 
    
    this.setType(this.getConfig().Handshake);       
  }
}

module.exports = RequestPacket;