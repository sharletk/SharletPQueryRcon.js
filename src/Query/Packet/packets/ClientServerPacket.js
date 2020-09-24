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
 *   @file ClientServerPacket.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const Packet = require("../Packet.js");

class ClientServerPacket extends Packet {
  constructor() {
    super();
    
    this._init();
  }
  
  /**
   * Initialize the magic.
   *
   */
  
  _init() {
    this.setMagic(this.getConfig().Magic);
  }
}

module.exports = ClientServerPacket;