const ServerClientPacket = require("./ServerClientPacket.js");

class BasicResponsePacket extends ServerClientPacket {
  constructor() {
    super();
    
    this._payload = [];
  }
  
  _decodePayload() {    
    console.log(this._buffer);
    console.log(this._offset);
    console.log(this.getRemainingLength());
    for (let i = 1; i <= 7; i++) {
      if (i == 6) {
        this._payload.push(this.readLShort());
        continue;
      }
            
      this._payload.push(this.readString().replace("\x00", ""));
    }        
  }
}

module.exports = BasicResponsePacket;