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
  
  // Bool Methods  
  readBool(b) {
    return this.readByte(b) !== 0;
  }
  
  writeBool(b) {
    return this.writeByte(b === true ? 1 : 0);
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
  
  
  // Triad Methos
  readTriad(offset = this._offsetChange(3), byteLength = 3) { 
    return this.buffer.readIntBE(offset, byteLength);
  }
  
  writeTriad(v, offset = 0, byteLength) {
    return this._writeTriad(v, offset, byteLength, "BE");
  }
  
  readLTriad(offset = this._offsetChange(3), byteLength = 3) { 
    return this.buffer.readIntLE(offset, byteLength);
  }
  
  writeLTriad(v, offset = 0, byteLength) {
    return this._writeTriad(v, offset, byteLength, "LE");
  }
  
  _writeTriad(v, offset, byteLength = 3, type) {
    let buf = Buffer.alloc(3);
    
    switch(type) {
      case "BE":
      buf.writeIntBE(v, offset, byteLength);
      break;
      
      case "LE":
      buf.writeIntLE(v, offset, byteLength);
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
  
  
  // Float Methos
  readFloat(offset = this._offsetChange(4)) { 
    return this.buffer.readFloatBE(offset);
  }
  
  readRoundedFloat() {
    
  }
  
  writeFloat(v, offset) {
    return this._writeFloat(v, offset, "BE");
  }
  
  readLFloat(offset = this._offsetChange(4)) { 
    return this.buffer.readFloatLE(offset);
  }
  
  readRoundedLFloat() {
    
  }
  
  writeLFloat(v, offset) {
    return this._writeFloat(v, offset, "LE");
  }
  
  _writeFloat(v, offset, type) {
    let buf = Buffer.alloc(8);
    
    switch(type) {
      case "BE":
      buf.writeFloatBE(v, offset);
      break;
      
      case "LE":
      buf.writeFloatLE(v, offset);
      break;
    }
    return this.writeData(buf);
  }  
  
  // Double Methods
  readDouble(offset = this._offsetChange(8)) { 
    return this.buffer.readDoubleBE(offset);
  }
  
  writeDouble(v, offset) {
    return this._writeDouble(v, offset, "BE");
  }
  
  readLDouble(offset = this._offsetChange(8)) {
    return this.buffer.readDoubleLE(offset);
  }
  
  writeLDouble(v, offset) {
    return this._writeDouble(v, offset, "LE");
  }
  
  _writeDouble(v, offset, type) {
    let buf = Buffer.alloc(8);
    
    switch(type) {
      case "BE":
      buf.writeDoubleBE(v, offset);
      break;
      
      case "LE":
      buf.writeDoubleLE(v, offset);
      break;
    }
    return this.writeData(buf);
  }
  
  
  // Long Methods
  readLong(offset = this._offsetChange(8)) { 
    return Number(this.buffer.readBigUInt64BE(offset).toString());
  }
  
  writeLong(v, offset) {
    return this._writeLong(v, offset, "BE");
  }
  
  readLLong(offset = this._offsetChange(8)) { 
    return Number(this.buffer.readBigUInt64LE(offset).toString());
  }
  
  writeLLong(v, offset) {
    return this._writeLong(v, offset, "LE");
  }
  
  _writeLong(v, offset, type) {
    let buf = Buffer.alloc(8);
    v = BigInt(v);
    
    switch(type) {
      case "BE":
      buf.writeBigUInt64BE(v);
      break;
      
      case "LE":
      buf.writeBigUInt64LE(v);
      break;
    }
    return this.writeData(buf);
  }
  
  
  // VarInt Methods  
  readUnsignedVarInt(buffer = this.getBuffer(), offset = this.getOffset()) {
    let value = 0;
    
    for (let i = 0; i <= 28; i += 7) {
      if (!(buffer[offset])) {
        throw new Error("No bytes left in buffer!");
      }
      
      let b = this.readByte();
      value |= ((b & 0x7f) << i);
      
      if ((b & 0x80) === 0) return value;
    }
    
    throw new Error("VarInt did not terminate after 5 bytes!");
  }
  
  readVarInt(buffer = this.getBuffer(), offset = this.getOffset()) {
    let raw = this.readUnsignedVarInt(buffer, offset);
    
    let temp = (((raw << 63) >> 63) ^ raw) >> 1;
    
    return temp ^ (raw & (1 << 63));
  }
  
  writeUnsignedVarInt(value) {    
    value &= 0xffffffff;    
    for (let i = 0; i < 5; ++i) {
      if ((value >> 7) !== 0) {
        this.writeByte(value | 0x80);
      } else {
        this.writeByte(value & 0x7f);
        return this;
      }
      
      value = ((value >> 7) & (Number.MAX_SAFE_INTEGER >> 6));
    }
    
    throw new Error("Value too large to ve encoded as a VarInt.");
  }
  
  writeVarInt(value) {
    value = (value << 32 >> 32);
    return this.writeUnsignedVarInt((value << 1) ^ (value >> 31));
  }
  
  
  // VarLong Methods
  readUnsignedVarLong(buffer = this.getBuffer(), offset = this.getOffset()) {
    let value = 0;
    for (let i = 0; i <= 63; i += 7) {
      if (!(buffer[offset])) {
        throw new Error("No bytes left in buffer!");
      }
      
      let b = this.readByte();
      value |= ((b & 0x7f) << i);
      
      if ((b & 0x80) === 0) return value;
    }
    
    throw new Error("VarLong did not terminate after 10 bytes!");
  }
  
  readVarLong(buffer = this.getBuffer(), offset = this.getOffset()) {
    let raw = this.readUnsignedVarLong(buffer, offset);
    
    let temp = (((raw << 63) >> 63) ^ raw) >> 1;
    
    return temp ^ (raw & (1 << 63));
  }
  
  writeUnsignedVarLong(value) {
    for (let i = 0; i < 10; ++i) {
      if ((value >> 7) !== 0) {
        this.writeByte(value | 0x80);
      } else {
        this.writeByte(value & 0x7f);
        return this;
      }
      
      value = ((value >> 7) & (Number.MAX_SAFE_INTEGER >> 6));
    }
    
    throw new Error("Value too large to ve encoded as a VarLong.");
  }
  
  writeVarLong(value) {
    return this.writeUnsignedVarLong((value << 1) ^ (value >> 63));
  }
}

module.exports = BinaryStream;