const BinaryStream = require("../../BinaryStream/BinaryStream.js");

class Packet extends BinaryStream {
  constructor() {
    super();
    
    this._config = require("../configs/config.js");
    
    this._requestID;
    this._type;
    this._payload;
    this._length;
  }
  
  _generateRequestID() {
    const min = -2147483648;
    const max = 2147483647;
    
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  getRequestID() {
    return this._requestID;
  }
  
  setRequestID(requestID) {
    this._requestID = requestID;
  }
  
  getConfig() {
    return this._config;
  }
  
  getType() {
    return this._type;
  }
  
  setType(type) {
    this._type = type;
  }
  
  getPayload() {
    return this._payload;
  }
  
  setPayload(payload) {
    this._payload = payload;
  }
  
  getLength() {
    return this._length;
  }
  
  setLength(length) {
    this._length = length;
  }
  
  encode() {
    this._encodeHeader();
    this._encodePayload(); 
    
    return this;   
  }
  
  _encodeHeader() {
    let length = Buffer.byteLength(this.getPayload(), "ascii");
    
    this.writeLInt(10 + length);
    this.writeLInt(this.getRequestID());
    this.writeLInt(this.getType());
  }
  
  _encodePayload() {
    
  }
  
  decode() {
    this._decodeHeader();
    this._decodePayload();
    
    return this;
  }
  
  _decodeHeader() {
    this.setLength(this.readLInt());
    this.setRequestID(this.readLInt());
    this.setType(this.readLInt());
  }
  
  _decodePayload() {
    
  }
}

module.exports = Packet;