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
 *   @file FullRequestPacket.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const ClientServerPacket = require("./ClientServerPacket.js");

class FullRequestPacket extends ClientServerPacket {
  constructor() {
    super();
    
    this.setType(this.getConfig().Statistics);
  }
  
  /**
   * Encode the packet payload.
   *
   */
  
  _encodePayload() {
    this.writeInt(this.getToken()); // Encode the challenge token.
    this.writeInt(0); // Encode a 4 byte padding.
  }
}

module.exports = FullRequestPacket;