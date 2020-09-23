const Packet = require("../Packet.js");

class ClientServerPacket extends Packet {
  constructor() {
    super();
    
    this._init();
  }
  
  _init() {
    this.setMagic(this.getConfig().Magic);
  }
}

module.exports = ClientServerPacket;