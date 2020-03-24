"use strict";

const Packet = require("./Packet.js");

class Login extends Packet {
  constructor() {
    super();
    
    this.requestID = this.writeRequestID();
    this.type = this.RCONConfig.LOGIN;
  }
};

module.exports = Login;