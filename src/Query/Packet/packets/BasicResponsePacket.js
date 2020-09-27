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
 *   @file BasicResponsePacket.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const ServerClientPacket = require("./ServerClientPacket.js");

class BasicResponsePacket extends ServerClientPacket {
  constructor() {
    super();
    
    this._payload = [];
  }
  
  /**
   * Decode the payload.
   *
   */
  
  _decodePayload() {    
    for (let i = 1; i <= 7; i++) {
      if (i == 6) {
        this._payload.push(this.readLShort());
        continue;
      }
            
      this._payload.push(this.readString().replace("\x00", ""));
    }        
  }
}

module.exports = BasicResponsePacket;