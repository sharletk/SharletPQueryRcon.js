class BinaryStream {
  constructor() {
    this._buffer = Buffer.alloc(0);
    this._offset = 0;
    
    this._encoding = "utf8";
  }
  
  getBuffer() {
    return this._buffer;
  }
  
  setBuffer(buffer) {
    this._buffer = buffer;
  }
  
  getOffset() {
    return this._offset;
  }
  
  setOffset(offset) {
    this._offset = offset;
  }
  
  reset() {
    this._buffer = Buffer.alloc(0);
    this._offset = 0;
  }
  
  rewind() {
    this._offset = 0;    
  }
  
  feof() {
    return this._offset >= this._buffer.length || typeof this._buffer[this._offset] === "undefined";
  }
  
  concat(buf) {
    this._buffer = Buffer.concat([this._buffer, buf], this.length + buf.length());
    return this._buffer;
  }
  
  slice(start, end) {
    return this._buffer.slice(start, end);
  }
  
  getRemainingLength() {
    if (this.feof()) return null;
    
    return this._buffer.length - this._offset;
  }
  
  getRemainingBytes() {
    let remainingLength = this.getRemainingLength();
    
    return this._buffer.slice(this._offset, remainingLength);
  }
  
  getLength() {
    return this._buffer.length;
  }
  
  toString(type = this._encoding) {
    return this._buffer.toString(type);
  }
  
  toJSON() {
    return JSON.parse(this._buffer.toString());
  }
  
  toHex() {
    return this._buffer.toString("hex");
  }
  
  entries() {
    return this._buffer.entries();
  }
  
  _offsetChange(value, ret = false) {
    return ret ? this._offset += value : (this._offset += value) - value;
  }
  
  read(offset, offsetChange = true) {
    return this._buffer.slice(this._offset, this._offsetChange(offset, offsetChange));
  }
  
  _append(buf) {
    this._buffer = Buffer.concat([this._buffer, buf], this._buffer.length + buf.length);
    this._offset = this._buffer.length;
    return this;
  }
  
  write(buf) {
    if (Buffer.isBuffer(buf) || buf instanceof Buffer) {
      this._append(buf);
    } else if (Array.isArray(buf)) {
      buf = Buffer.from(buf);
      this._append(buf);
    } else if (typeof buf == "string" || typeof buf == "number") {
      buf = Buffer.from(buf.toString());
      this._append(buf);
    } else {
      buf = Buffer.from(buf);
      this._append(buf);
    }
    
    return this;
  }
  
  readByte(offset = this._offsetChange(1)) {
    return this._buffer.readUInt8(offset);
  }
  
  readSignedByte(offset = this._offsetChange(1)) {
    return this._buffer.readInt8(offset);
  }
  
  writeByte(value) {
    this._append(Buffer.from([value & 0xff]));
  }
  
  readBool() {
    return this.readByte() ? 1 : 0;
  }
  
  writeBool(value) {
    this.writeByte(value ? 1 : 0);
  }
  
  readShort(offset = this._offsetChange(2)) {
    return this._buffer.readUInt16BE(offset);
  }
  
  readSignedShort(offset = this._offsetChange(2)) {
    return this._buffer.readInt16BE(offset);
  }
  
  writeShort(value) {
    this.writeByte((value >> 8) & 0xff);
    this.writeByte(value & 0xff);
  }
  
  readLShort(offset = this._offsetChange(2)) {
    return this._buffer.readUInt16LE(offset);
  }
  
  readSignedLShort(offset = this._offsetChange(2)) {
    return this._buffer.readInt16LE(offset);
  }
  
  writeLShort(value) {
    this.writeByte(value & 0xff);
    this.writeByte((value >> 8) & 0xff);
  }
  
  readInt(offset = this._offsetChange(4)) {
    return this._buffer.readInt32BE(offset);
  }
  
  writeInt(value) {
    let buf = Buffer.alloc(4);
    buf.writeInt32BE(value);
    this._append(buf);
  } 
  
  readLInt(offset = this._offsetChange(4)) {
    return this._buffer.readInt32LE(offset);
  }
  
  writeLInt(value) {
    let buf = Buffer.alloc(4);
    buf.writeInt32LE(value);
    this._append(buf);
  } 
  
  readUnsignedVarInt() {
    let value = 0;
    for (let i = 0; i <= 28; i += 7) {
      if (typeof this._buffer[this._offset] === 'undefined') {
        throw new Error('No bytes left in buffer');
      }
      
      let b = this.readByte();
      
      value |= ((b & 0x7f) << i);
      
      if ((b & 0x80) === 0) { 
        return value;
      }
    }
    
    throw new Error('VarInt did not terminate after 5 bytes!');
  }
  
  writeUnsignedVarInt(value) {
    let binstream = new BinaryStream();
    value &= 0xffffffff;
    
    for (let i = 0; i < 5; i++) { 
      if ((value >> 7) !== 0) {
         binstream.writeByte(value | 0x80) 
      } else { 
         binstream.writeByte(value & 0x7f);
         this._append(binstream._buffer);
         return;
      } 
      value >>= 7;
    }
    
    this._append(binstream._buffer);
  }
  
  readVarInt() {
    let raw = this.readUnsignedVarInt();
    let temp = (((raw << 63) >> 63) ^ raw) >> 1;
    return temp ^ (raw & (1 << 63)) 
  }
  
  writeVarInt(value) {
    value = (value << 32 >> 32);
    return this.writeUnsignedVarInt((v << 1) ^ (v >> 31));
  }
  
  _readString() {
    return this.read(this.readUnsignedVarInt()).toString();
  }
  
  _writeString(value) {
    this.writeUnsignedVarInt(Buffer.byteLength(value));
    this._append(Buffer.from(value, this._encoding));
  }
  
  readString() {
    let start = this._offset;
    let b = this.readByte();
    while(b !== 0) {
      b = this.readByte();
    }
    
    return this._buffer.toString(this._encoding, start, this._offset);
  }
  
  writeString(value) {
    let length = Buffer.byteLength(value);
    let buf = Buffer.alloc(length);
    buf.write(value, length, this._encoding);
    this._append(buf);
  }
}

module.exports = BinaryStream;