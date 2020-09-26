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
 *   @file HandshakeResponsePacket.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const ServerClientPacket = require("./ServerClientPacket.js");

class HandshakeResponsePacket extends ServerClientPacket {
  constructor() {
    super();
  }
  
  /**
   * Decode the packet payload.
   *
   */
  
  _decodePayload() {
    this.setToken(this.readString().replace("\x00", "")); // Decode the challenge token.
  }
}

module.exports = HandshakeResponsePacket;