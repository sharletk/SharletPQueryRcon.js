"use strict";

const BinaryStream = require("../../binarystream/binarystream.js");

const QueryConfig = require("../QueryConfig.js");

class Packet extends BinaryStream {
  constructor() {
    super();
    this.QueryConfig = QueryConfig;
    
    this.sessionID = -1;
  }
  
  readSessionID() {
    
  }
  
  writeSessionID() {
    let min = -2147483648;
    let max = 2147483647;
    
    this.sessionID = Math.floor(Math.random() * (max - min)) + min;
    return this.sessionID;
  }
  
  readString() {
    let varint = this.readUnsignedVarInt();
    
    let offset = this.getOffset();
    this.setOffset(offset - 1);
    
    return this.readData(varint);
  }
  
  parseString() {
    return this.readString().toString();
  }
  
  writeString(str) {
    this.writeUnsignedVarInt(Buffer.byteLength(str));
    this.writeData(Buffer.from(str, "utf8"));
  }
  
  encode() {
    this.encodeHeader()
    this.encodePayload();
  }
  
  encodeHeader() {
    
  }
  
  encodePayload() {
    
  }
  
  decode() {
    this.rewind();
    this.decodeHeader();
    this.decodePayload();
  }
  
  decodeHeader() {
    
  }
  
  decodePayload() {
    
  }
};

module.exports = Packet;