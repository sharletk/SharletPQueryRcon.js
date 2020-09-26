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
 *   @file Packet.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

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
  
  /**
   * Generate a unique request ID
   *
   * @return {number}
   */
  
  _generateRequestID() {
    const min = -2147483648;
    const max = 2147483647;
    
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  /**
   * Return the request ID
   *
   * @return {number}
   */
  
  getRequestID() {
    return this._requestID;
  }
  
  /**
   * Set the request ID.
   *
   * @param {number} requestID
   */
  
  setRequestID(requestID) {
    this._requestID = requestID;
  }
  
  /**
   * Get the configuration.
   *
   * @return {object}
   */
  
  getConfig() {
    return this._config;
  }
  
  /**
   * Return the packet type.
   *
   * @return {number}
   */
  
  getType() {
    return this._type;
  }
  
  /**
   * Set the packet type.
   *
   * @param {number} type
   */
  
  setType(type) {
    this._type = type;
  }
  
  /**
   * Get the payload stored internally.
   *
   * @return {*}
   */
  
  getPayload() {
    return this._payload;
  }
  
  /**
   * Set the payload stored internally.
   *
   * @param {*} payload
   */
  
  setPayload(payload) {
    this._payload = payload;
  }
  
  /**
   * Return the packet remainder length.
   *
   * @return {number}
   */
  
  getLength() {
    return this._length;
  }
  
  /**
   * Set the packet remainder length.
   *
   * @param {number} length
   */
  
  setLength(length) {
    this._length = length;
  }
  
  /**
   * Encode the packet.
   *
   * @return {*}
   */
  
  encode() {
    this._encodeHeader();
    this._encodePayload(); 
    
    return this;   
  }
  
  /**
   * Encode the packet header.
   *
   */
  
  _encodeHeader() {
    let length = Buffer.byteLength(this.getPayload(), "ascii");
    
    this.writeLInt(10 + length); // Encode the packet remainder length. (Here the first 10 bytes include the  requestID [4 bytes] + type [4 bytes] + padding [2 bytes])
    this.writeLInt(this.getRequestID()); // Encode the request ID.
    this.writeLInt(this.getType()); // Encode the packet type.
  }
  
  /**
   * Encode the packet payload.
   *
   */
  
  _encodePayload() {
    
  }
  
  /**
   * Decode the packet.
   *
   * @return {*}
   */
  
  decode() {
    this._decodeHeader();
    this._decodePayload();
    
    return this;
  }
  
  /**
   * Decode the packet header.
   *
   */
  
  _decodeHeader() {
    this.setLength(this.readLInt()); // Decode the packet remainder length.
    this.setRequestID(this.readLInt()); // Decode the request ID.
    this.setType(this.readLInt()); // Decode the packet type.
  }
  
  /**
   * Decode the packet payload.
   *
   */
  
  _decodePayload() {
    
  }
}

module.exports = Packet;