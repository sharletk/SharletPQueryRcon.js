const BinaryStream = require("../../BinaryStream/BinaryStream.js");

class Packet extends BinaryStream {
  constructor() {
    super();
    
    this._config = require("../configs/config.js");
    
    this._sessionID;
    this._magic;
    this._type;
    this._token;
    this._payload;
  }
  
  _generateSessionID() {
    const min = -2147483648;
    const max = 2147483647;
    
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  getSessionID() {
    return this._sessionID;
  }
  
  setSessionID(sessionID) {
    this._sessionID = sessionID;
  }
  
  getConfig() {
    return this._config;
  }
  
  getMagic() {
    return this._magic;
  }
  
  setMagic(magic) {
    this._magic = magic;
  }
  
  getType() {
    return this._type;
  }
  
  setType(type) {
    this._type = type;
  }
  
  getToken() {
    return this._token;
  }
  
  setToken(token) {
    this._token = token;
  }
  
  getPayload() {
    return this._payload;
  }
  
  setPayload(payload) {
    this._payload = payload;
  }
  
  encode() {
    this._encodeHeader();
    this._encodePayload();
    
    return this;
  }
  
  _encodeHeader() {
    this.writeShort(this.getMagic());
    this.writeByte(this.getType());
    this.writeInt(this.getSessionID());
  }
  
  _encodePayload() {
    
  }
  
  decode() {
    this._decodeHeader();
    this._decodePayload();
    
    return this;
  }
  
  _decodeHeader() {
    this.setType(this.readByte());
    this.setSessionID(this.readInt());
  }
  
  _decodePayload() {
    
  }
}

module.exports = Packet;