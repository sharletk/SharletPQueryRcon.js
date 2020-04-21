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
    let varint = this.readUnsignedVarInt();
    
    return this.readData(varint);
  }
  
  parseString() {
    return this.readString().toString();
  }
  
  writeString(str) {
    this.writeUnsignedVarInt(Buffer.byteLength(str));
    if (str.length === 0) return this;
    this.writeData(Buffer.from(str, "utf8"));
    return this;
  }
  
  encode() {
    this.encodeHeader()
    this.encodePayload();
    
    this.size = this.length - 1;
    let bufSize = new BinaryStream().writeLInt(this.size);
    this.buffer = Buffer.concat([bufSize.buffer, this.buffer]);
    this.setOffset(this.length);
  }
  
  encodeHeader() {
    this.writeLInt(this.requestID);
    this.writeLInt(this.type);
  }
  
  encodePayload() {
    this.writeString(this.payload);
    this.writeShort(0);
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