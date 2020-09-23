const ServerClientPacket = require("./ServerClientPacket.js");

class BasicResponsePacket extends ServerClientPacket {
  constructor() {
    super();
    
    this._data = {};
  }
  
  _decodePayload() {
    this.setType(this.readByte());
    this.setSessionID(this.readInt());
    
    console.log(this.readString());
    
    this._data = {
       
    }
  }
}

module.exports = BasicResponsePacket;