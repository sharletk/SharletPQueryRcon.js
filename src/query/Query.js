"use strict";

const BinaryStream = require("../binarystream/BinaryStream.js");
const Socket = require("../socket/Socket.js");

class Query {
  constructor(console) {
    this.console = console;
    
    this.socket;
  }
  
  createSocket(address) {
    this.socket = new Socket(this.console);
    
    this.socket.setup(address);
  }
};

module.exports = Query;