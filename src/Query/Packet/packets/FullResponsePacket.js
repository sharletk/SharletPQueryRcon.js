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
    this.read(11); // Decode the splitnum       
    
    for (let i = 1; i <= 24; i++) {
      this._payload.push(this.readString().replace("\x00", ""));
    }       
    
    this.read(11); // Decode the extra unwated player padding.      
    
    let players = [];
    let numplayers = 0;
    
    if (this._payload.includes("numplayers")) {
      let index = this._payload.indexOf("numplayers") + 1;
      numplayers = Number(this._payload[index]);
    }
    
    if (!(this.feof())) {
      for (let i = 1; i <= numplayers; i++) {
        players.push(this.readString().replace("\x00", ""));
      }
    }
    
    this._payload.push("players", players);
  }
}

module.exports = FullResponsePacket;