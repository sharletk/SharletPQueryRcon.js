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
 *   @file FullResponsePacket.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const ServerClientPacket = require("./ServerClientPacket.js");

class FullResponsePacket extends ServerClientPacket {
  constructor() {
    super();
    
    this._payload = [];
  }
  
  /**
   * Decode the packet payload.
   *
   */
  
  _decodePayload() {    
    console.log(this._buffer);
    console.log(this._offset);
    console.log(this.getRemainingLength());
    
    this.read(11);
    
    for (let i = 1; i <= 20; i++) {                        
      this._payload.push(this.readString().replace("\x00", ""));
    }
    
    this.read(12);
    
    let players = [];
    if (!(this.feof())) {
      for (let i = 1; i <= Nunber(this._payload[13]); i++) {
        players.push(this.readString().replace("\x00", ""));
      }
    }
    
    this._payload.push(players);
  }
}

module.exports = FullResponsePacket;