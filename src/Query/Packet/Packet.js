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
    
    this._sessionID;
    this._magic;
    this._type;
    this._token;
    this._payload;
  }
  
  /**
   * Generates a new Session ID.
   *
   */
   
  _generateSessionID() {
    const min = -2147483648;
    const max = 2147483647;
    
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  /**
   * Returns the Session ID.
   *
   * @return {number}
   */
  
  getSessionID() {
    return this._sessionID;
  }
  
  /**
   * Set the Session ID.
   *
   * @param {number} sessionID
   */
  
  setSessionID(sessionID) {
    this._sessionID = sessionID;
  }
  
  /**
   * Return the configuration.
   *
   * @return {object}
   */
  
  getConfig() {
    return this._config;
  }
  
  /**
   * Return the packet magic.
   *
   * @return {*}
   */
  
  getMagic() {
    return this._magic;
  }
  
  /**
   * Set the packet magic.
   *
   * @param {string} magic
   */
  
  setMagic(magic) {
    this._magic = magic;
  }
  
  /**
   * Return the packet type.
   *
   * @return {*}
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
   * Get the challenge token
   *
   * @return {string} token
   */
  
  getToken() {
    return this._token;
  }
  
  /**
   * Set the challenge token.
   *
   * @param {string} token
   */
  
  setToken(token) {
    this._token = token;
  }
  
  /**
   * Get the attached payload.
   *
   * @return {object}
   */
  
  getPayload() {
    return this._payload;
  }
  
  /**
   * Set the attached payload
   *
   * @param {*} payload
   */
  
  setPayload(payload) {
    this._payload = payload;
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
    this.writeShort(this.getMagic()); // Encode the Query Magic
    this.writeByte(this.getType()); // Encode the Packet Type
    this.writeInt(this.getSessionID()); // Encode the Session ID.
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
    this.setType(this.readByte()); // Decode the packet type.
    this.setSessionID(this.readInt()); // Decode the Session ID.
  }
  
  /**
   * Decode the packet payload.
   *
   */
  
  _decodePayload() {
    
  }
}

module.exports = Packet;