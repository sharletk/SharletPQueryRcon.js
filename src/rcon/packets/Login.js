"use strict";

const Packet = require("./Packet.js");

class Login extends Packet {
  constructor() {
    super();
    
    this.requestID = 1;
    this.type = this.RCONConfig.LOGIN;
  }
};

module.exports = Login;