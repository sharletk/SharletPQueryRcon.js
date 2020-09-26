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
 *   @file CommandPacket.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const ServerClientPacket = require("./ServerClientPacket.js");

class CommandPacket extends ServerClientPacket {
  constructor() {
    super();
    
    this._init();
  }
  
  /**
   * Initialize the packet type.
   *
   */
  
  _init() {
    this.setType(this.getConfig().Command);
  }
  
  /**
   * Encode the packet payload.
   *
   */
  
  _encodePayload() {
    this.writeString(this.getPayload(), "ascii"); // Encode the payload string.
    this.writeShort(0); // Encode the padding bytes.
  }
}

module.exports = CommandPacket;