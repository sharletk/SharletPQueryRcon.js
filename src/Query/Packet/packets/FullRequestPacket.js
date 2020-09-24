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
    
    this.setType(this.getConfig().Statistics)
  }
  
  /**
   * Encode the packet payload.
   *
   */
  
  _encodePayload() {
    this.writeInt(this.getToken());
    this.writeInt(0);
  }
}

module.exports = FullRequestPacket;