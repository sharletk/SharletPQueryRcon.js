/**
 *
 *
 *
 * ╭━━━┳╮╱╱╱╱╱╱╭╮╱╱╱╭╮╭━━━╮
 * ┃╭━╮┃┃╱╱╱╱╱╱┃┃╱╱╭╯╰┫╭━╮┃
 * ┃╰━━┫╰━┳━━┳━┫┃╭━┻╮╭┫╰━╯┃
 * ╰━━╮┃╭╮┃╭╮┃╭┫┃┃┃━┫┃┃╭━━╯
 * ┃╰━╯┃┃┃┃╭╮┃┃┃╰┫┃━┫╰┫┃
 * ╰━━━┻╯╰┻╯╰┻╯╰━┻━━┻━┻╯
 *
 *
 *
 *  @author SharletP
 *   @file BinaryStream.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

class BinaryStream {
  constructor() {
    this._buffer = Buffer.alloc(0);
    this._offset = 0;
    
    this._encoding = "utf8";
  }
  
  /**
   * Return the buffer.
   *
   * @return {buffer}
   */
  
  getBuffer() {
    return this._buffer;
  }
  
  /**
   * Set the buffer.
   *
   * @param {buffer} buffer
   */
  
  setBuffer(buffer) {
    this._buffer = buffer;
  }
  
  /**
   * Return the offset.
   *
   * @return {number} offset
   */
  
  getOffset() {
    return this._offset;
  }
  
  /**
   * Set the offset.
   *
   * @param {number} offset
   */
  
  setOffset(offset) {
    this._offset = offset;
  }
  
  /**
   * Reset the stream.
   *
   */
  
  reset() {
    this._buffer = Buffer.alloc(0);
    this._offset = 0;
  }
  
  /**
   * Rewind the offset.
   *
   */
  
  rewind() {
    this._offset = 0;    
  }
  
  /**
   * Checks if buffer has been completely filled.
   *
   * @return {bool}
   */
  
  feof() {
    return this._offset >= this._buffer.length || typeof this._buffer[this._offset] === "undefined";
  }
  
  /**
   * Concatenate another buffer with the stream buffer.
   *
   * @param {buffer} buf
   * @return {buffer}
   */
  
  concat(buf) {
    this._buffer = Buffer.concat([this._buffer, buf], this.length + buf.length());
    return this._buffer;
  }
  
  /**
   * Slice the buffer.
   *
   * @param {number} start
   * @param {number} end
   * @return {buffer}
   */
  
  slice(start, end) {
    return this._buffer.slice(start, end);
  }
  
  /**
   * Get the remaining length left of the buffer or null.
   *
   * @return {number || null}
   */
  
  getRemainingLength() {
    if (this.feof()) return null;
    
    return this._buffer.length - this._offset;
  }
  
  /**
   * Get the remaining bytes from the offset in the buffer.
   *
   * @return {buffer}
   */
  
  getRemainingBytes() {
    let remainingLength = this.getRemainingLength();
    
    return this._buffer.slice(this._offset, remainingLength);
  }
  
  /**
   * Get the length of the buffer.
   *
   * @return {number}
   */
  
  getLength() {
    return this._buffer.length;
  }
  
  /**
   * Convert the buffer to a string.
   *
   * @param {string} type
   * @return {string}
   */
  
  toString(type = this._encoding) {
    return this._buffer.toString(type);
  }
  
  /**
   * Convert the buffer to JSON format.
   *
   * @return {object}
   */
  
  toJSON() {
    return JSON.parse(this._buffer.toString());
  }
  
  /**
   * Convert the buffer to HEX format.
   *
   * @return {string}
   */
  
  toHex() {
    return this._buffer.toString("hex");
  }
  
  /**
   * Entries within the buffer.
   *
   * @return {*}
   */
  
  entries() {
    return this._buffer.entries();
  }
  
  /**
   * Change the offset as per requirement.
   *
   * @param {number} value
   * @param {bool} ret
   * @return {number}
   */
  
  _offsetChange(value, ret = false) {
    return ret ? this._offset += value : (this._offset += value) - value;
  }
  
  /**
   * Reads data from the buffer.
   *
   * @param {number} offset
   * @param {bool} offsetChange
   * @return {buffer}
   */
  
  read(offset, offsetChange = true) {
    return this._buffer.slice(this._offset, this._offsetChange(offset, offsetChange));
  }
  
  /**
   * Append to the buffer.
   *
   * @param {buffer} buf
   * @return {*}
   */
  
  _append(buf) {
    this._buffer = Buffer.concat([this._buffer, buf], this._buffer.length + buf.length);
    this._offset = this._buffer.length;
    return this;
  }
  
  /**
   * Write data to the buffer.
   *
   * @param {*} buf
   * @return {*}
   */
  
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
  
  /**
   * Read a Unsigned Byte.
   *
   * @param {number} offset
   * @return {*}
   */
  
  readByte(offset = this._offsetChange(1)) {
    return this._buffer.readUInt8(offset);
  }
  
  /**
   * Read a Signed Byte.
   *
   * @param {number} offset
   * @return {*}
   */
  
  readSignedByte(offset = this._offsetChange(1)) {
    return this._buffer.readInt8(offset);
  }
  
  /**
   * Write a Unsigned/Signed Byte.
   *
   * @param {number} value
   */ 
  
  writeByte(value) {
    this._append(Buffer.from([value & 0xff]));
  }
  
  /**
   * Read a Bool Byte.
   *
   * #return {bool}
   */
  
  readBool() {
    return this.readByte() ? true : false;
  }
  
  /**
   * Wrie a Bool Byte.
   *
   * @param {number} value
   */
  
  writeBool(value) {
    this.writeByte(value ? 1 : 0);
  }
  
  /**
   * Read a Unsigned Big Endian Short.
   *
   * @parse {number} offset
   * @return {*}
   */
  
  readShort(offset = this._offsetChange(2)) {
    return this._buffer.readUInt16BE(offset);
  }
  
  /**
   * Read a Signed Big Endian Short.
   *
   * @parse {number} offset
   * @return {*}
   */
  
  readSignedShort(offset = this._offsetChange(2)) {
    return this._buffer.readInt16BE(offset);
  }
  
  /**
   * Write a Unsigned/Signed Short.
   *
   * @parse {number} value
   */
  
  writeShort(value) {
    this.writeByte((value >> 8) & 0xff);
    this.writeByte(value & 0xff);
  }
  
  /**
   * Read a Little Endian Short.
   *
   * @parse {number} offset
   * @return {*}
   */
  
  readLShort(offset = this._offsetChange(2)) {
    return this._buffer.readUInt16LE(offset);
  }
  
  /**
   * Read a Signed Little Endian Short.
   *
   * @parse {number} offset
   * @return {*}
   */
  
  readSignedLShort(offset = this._offsetChange(2)) {
    return this._buffer.readInt16LE(offset);
  }
  
  /**
   * Write a Little Endian Unsigned/Signed Short.
   *
   * @parse {number} offset
   * @return {*}
   */
  
  writeLShort(value) {
    this.writeByte(value & 0xff);
    this.writeByte((value >> 8) & 0xff);
  }
  
  /**
   * Read a 32-bit Signed Big Endian Integer.
   *
   * @parse {number} offset
   * @return {*}
   */
  
  readInt(offset = this._offsetChange(4)) {
    return this._buffer.readInt32BE(offset);
  }
  
  /**
   * Write a 32-bit Signed Big Endian Integer.
   *
   * @parse {number} offset
   * @return {*}
   */
  
  writeInt(value) {
    let buf = Buffer.alloc(4);
    buf.writeInt32BE(value);
    this._append(buf);
  } 
  
  /**
   * Read a 32-bit Signed Little Endian Integer.
   *
   * @parse {number} offset
   * @return {*}
   */
  
  readLInt(offset = this._offsetChange(4)) {
    return this._buffer.readInt32LE(offset);
  }
  
  /**
   * Write a 32-bit Signed Little Endian Integer.
   *
   * @parse {number} offset
   * @return {*}
   */
  
  writeLInt(value) {
    let buf = Buffer.alloc(4);
    buf.writeInt32LE(value);
    this._append(buf);
  } 
  
  /**
   * Read a 32 bit Unsigned Integer.
   *
   * @return {*}
   */
  
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
  
  /**
   * Write a 32 bit Unsigned Integer.
   *
   */
  
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
  
  /**
   * Read a 32 bit Signed Integer which is zigzig encoded.
   *
   * @return {*}
   */
   
  readVarInt() {
    let raw = this.readUnsignedVarInt();
    let temp = (((raw << 63) >> 63) ^ raw) >> 1;
    return temp ^ (raw & (1 << 63)) 
  }
  
  /**
   * Write a 32 bit Integer which is zigzag encoded.
   *
   * @return {*}
   */
  
  writeVarInt(value) {
    value = (value << 32 >> 32);
    return this.writeUnsignedVarInt((v << 1) ^ (v >> 31));
  }
  
  /**
   * Read a String.
   *
   * @return {string}
   */ 
   
   // DO NOT USE METHOD
  
  _readString() {
    return this.read(this.readUnsignedVarInt()).toString();
  }
  
  /**
   * Write a string.
   *
   * @param {string} value
   */
   
   // DO NOT USE METHOD
  
  _writeString(value) {
    this.writeUnsignedVarInt(Buffer.byteLength(value));
    this._append(Buffer.from(value, this._encoding));
  }
  
  /**
   * Read a String.
   *
   * @return {string}
   */ 
  
  readString() {
    let start = this._offset;
    let b = this.readByte();
    while(b !== 0) {
      b = this.readByte();
    }
    
    return this._buffer.toString(this._encoding, start, this._offset);
  }
  
  /**
   * Write a string.
   *
   * @param {string} value
   */
  
  writeString(value) {
    let length = Buffer.byteLength(value);
    let buf = Buffer.alloc(length);
    buf.write(value, length, this._encoding);
    this._append(buf);
  }
}

module.exports = BinaryStream;