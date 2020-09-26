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
 *   @file BasicRequestPacket.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const ClientServerPacket = require("./ClientServerPacket.js");

class BasicRequestPacket extends ClientServerPacket {
  constructor() {
    super();
    
    this.setType(this.getConfig().Statistics)
  }
  
  /**
  * Encode the payload.
  *
  */
  
  _encodePayload() {
    this.writeInt(this.getToken()); // Encode the challenge token.
  }
}

module.exports = BasicRequestPacket;