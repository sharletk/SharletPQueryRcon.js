"use strict";

const BinaryStream = require("../../binarystream/binarystream.js");
const RCONConfig = require("../RCONConfig.js");

class Packet extends BinaryStream {
  constructor() {
    super();
    this.RCONConfig = RCONConfig;
    
    this.size = 0;
    this.requestID = -1;
    this.type;
    
    this.payload;
  }
  
  readRequestID() {
    return this.requestID;
  }
  
  writeRequestID() {
    let min = -2147483648;
    let max = 2147483647;
    
    this.requestID = Math.floor(Math.random() * (max - min)) + min;
    return this.requestID;
  }
  
  readString() {
    return this.readData(this.readUnsignedVarInt());
  }
  
  parseString() {
    return this.readString().toString().replace("\u0000", "");
  }
  
  writeString(str) {
    this.writeUnsignedVarInt(Buffer.byteLength(str));
    this.writeData(Buffer.from(str, "utf8"));
  }
  
  encode() {
    this.encodeHeader()
    this.encodePayload();
    
    this.size = this.getSize();
    let bufSize = new BinaryStream().writeLInt(this.size);
    this.buffer = Buffer.concat([bufSize.buffer, this.buffer]);
  }
  
  encodeHeader() {
    this.writeLInt(this.requestID);
    this.writeLInt(this.type);
  }
  
  encodePayload() {
    this.writeString(this.payload);
    this.writeShort(0);
  }
  
  getSize() {
    return this.length;
  }
  
  decode() {
    this.rewind();
    this.decodeHeader();
    this.decodePayload();
  }
  
  decodeHeader() {
    this.size = this.readLInt();
    this.requestID = this.readLInt();
    this.type = this.readLInt();
  }
  
  decodePayload() {
    
  }
};

module.exports = Packet;