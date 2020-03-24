"use strict"

class BinaryStream {
  constructor(buffer = Buffer.alloc(0), offset = 0) {
    this.buffer = buffer;
    this.offset = offset;
    
    this._encoding = "utf8";
  }
  
  getStream() {
    return this;
  }
  
  reset() {
    this.buffer = Buffer.alloc(0);
    this.offset = 0;
  }
  
  getBuffer() {
    return this.buffer;
  }
  
  getOffset() {
    return this.offset;
  }
  
  setBuffer(buffer = Buffer.alloc(0), offset = 0) {
    this.buffer = buffer;
    this.offset = offset;
  }
  
  setOffset(offset = 0) {
    this.offset = offset;
  }
  
  rewind() {
    this.offset = 0;
  }
  
  feof() {
    return this.offset >= this.buffer.length;
  }
  
  entries() {
    return this.buffer.entries();
  }
  
  readData(length, offsetChange = true) {
    if(length === 0) return "ERROR: PROVIDE LENGTH";
    
    return this.buffer.slice(this.offset, this._offsetChange(length, true));
  }
  
  _offsetChange(v, ret = false) {
    return (ret === true ? (this.offset += v) : (this.offset += v) - v);
  }
  
  writeData(buf) {
    if(Buffer.isBuffer(buf)) {
      this._append(buf);
    } else if(Array.isArray(buf)) {
      buf = Buffer.from(buf);
      this._append(buf);
    } else if(buf instanceof Buffer) {
      this._append(buf);
    } else if(typeof buf === "string") {
      buf = Buffer.from(buf);
      this._append(buf);
    } else if(typeof buf === "number") {
      buf = Buffer.from(buf.toString());
      this._append(buf);
    } else if(typeof buf === "object") {
      buf = Buffer.from(buf);
      this._append(buf);
    }
    return this;
  }
    
  _append(buf) {
    this.buffer = Buffer.concat([this.buffer, buf]);
    this.offset += buf.length;
    return this;
  }
  
  toJSON() {
    return JSON.parse(this.buffer.toString());
  }
  
  toHex(buf) {
    return this.buffer.toString("hex");
  }
  
  toString(encoding = this._encoding, start = this.offset, end = this.buffer.length) {
    return this.buffer.toString(encoding, start, end);
  }
  
  get length() {
    return this.buffer.length;
  }
  
  getRemainingBytes() {
    return this.buffer.length - this.offset;
  }
  
  readRemaining() {
    let buf = this.buffer.slice(this.offset);
    this.offset = this.buffer.length;
    
    return buf;
  }
    
  
  // Byte Methods
  readByte(offset = this._offsetChange(1)) { 
    return this.buffer.readUInt8(offset);
  }
  
  writeByte(v, offset) {
    return this._writeByte(v, offset, "U");
  }
  
  readSignedByte(offset = this._offsetChange(1)) { 
    return this.buffer.readInt8(offset);
  }
  
  writeSignedByte(v, offset) {
    return this._writeByte(v, offset, "S");
  }
  
  _writeByte(v, offset, type) {
    let buf = Buffer.alloc(1);
    
    switch(type) {
      case "U":
      buf.writeUInt8(v, offset);
      break;
      
      case "S":
      buf.writeInt8(v, offset);
      break;
    }
    return this.writeData(buf);
  }
  
  
  // Short Methods 
  readShort(offset = this._offsetChange(2)) { 
    return this.buffer.readUInt16BE(offset);
  }
  
  writeShort(v, offset) {
    return this._writeShort(v, offset, "UBE");
  }
  
  readSignedShort(offset = this._offsetChange(2)) { 
    return this.buffer.readInt16BE(offset);
  }
  
  writeSignedShort(v, offset) {
    return this._writeShort(v, offset, "SBE");
  }
  
  readLShort(offset = this._offsetChange(2)) { 
    return this.buffer.readUInt16LE(offset);
  }
  
  writeLShort(v, offset) {
    return this._writeShort(v, offset, "ULE");
  }
  
  readSignedLShort(offset = this._offsetChange(2)) {
    return this.buffer.readInt16LE(offset);
  }
  
  writeSignedLShort(v, offset) {
    return this._writeShort(v, offset, "SLE");
  }
  
  _writeShort(v, offset, type) {
    let buf = Buffer.alloc(2);
    
    switch(type) {
      case "UBE":
      buf.writeUInt16BE(v, offset);
      break;
      
      case "SBE":
      buf.writeInt16BE(v, offset);
      break;
      
      case "ULE":
      buf.writeUInt16LE(v, offset);
      break;
      
      case "SLE":
      buf.writeInt16LE(v, offset);
      break;
    }
    return this.writeData(buf);
  }
  
  
  // Int Methods 
  readInt(offset = this._offsetChange(4)) { 
    return this.buffer.readInt32BE(offset);
  }
  
  writeInt(v, offset) {
    return this._writeInt(v, offset, "BE");
  }
  
  readLInt(offset = this._offsetChange(4)) {
    return this.buffer.readInt32LE(offset);
  }
  
  writeLInt(v, offset) {
    return this._writeInt(v, offset, "LE");
  }
  
  _writeInt(v, offset, type) {
    let buf = Buffer.alloc(4);
    
    switch(type) {
      case "BE":
      buf.writeInt32BE(v, offset);
      break;
      
      case "LE":
      buf.writeInt32LE(v, offset);
      break;
    }
    return this.writeData(buf);
  }
  
  
  // VarInt Methods  
  readUnsignedVarInt(buffer = this.getBuffer(), offset = this.getOffset()) {
    let value = 0;
    
    for (let i = 0; i <= 35; i += 7) {
      if (!(buffer[offset])) {
        throw new Error("No bytes left in buffer!");
      }
      
      let b = this.readByte();
      value |= ((b & 0x7f) << i);
      
      if ((b & 0x80) === 0) return value;
    }
    
    return 0;     
  }
  
  writeUnsignedVarInt(value) {
    let buf = new BinaryStream();
        
    for (let i = 0; i < 5; ++i) {
      if ((value >> 7) !== 0) {
        buf.writeByte(value | 0x80);
      } else {
        buf.writeByte(value & 0x7f);
        break;
      }
      
      value >>= 7;
    }
    
    this.writeData(buf.buffer);
    return this;
  }
}

module.exports = BinaryStream;