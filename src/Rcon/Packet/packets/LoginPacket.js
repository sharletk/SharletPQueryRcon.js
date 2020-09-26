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
 *   @file LoginPacket.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

const ClientServerPacket = require("./ClientServerPacket.js");

class LoginPacket extends ClientServerPacket {
  constructor() {
    super();
    
    this._init();
  }
  
  /**
   * Initialize the packet type.
   *
   */
  
  _init() {
    this.setType(this.getConfig().Login);
  }
  
  /**
   * Encode the packet payload.
   *
   */
  
  _encodePayload() {
    this.writeString(this.getPayload(), "ascii"); // Encode the authentication password.
    this.writeLShort(0); // Encode the padding.
  }
}

module.exports = LoginPacket;