"use strict";

const Socket = require("../socket/Socket.js");

class RCON {
  constructor(console) {
    this.console = console;
    
    this.socket = new Socket(console);
    
    this.packetPool = new Map();
    this.loadPackets();
    
    this.socket.setup();
    
    this.socket.getSocket().on("message", (message, rinfo) => {
      this.handle(message);
    });
    
    this.loggedIn = false;
  }
  
  loadPackets() {
    this.packetPool.set("Login", require("./packets/Login.js"));
    
    this.packetPool.set("Command", require("./packets/Command.js"));
    
    this.packetPool.set("CommandResponse", require("./packets/CommandResponse.js"));
  }
  
  login(address, port, password) {
    if (typeof address === "undefined" && typeof port === "undefined") return this.console.error("Error during query request, sufficient data not supplied to complete process.");
    
    this.socket.connect({
      "address": address,
      "port": port
    });
    
    let LoginPacket = this.packetPool.get("Login");
    LoginPacket = new LoginPacket();
    
    LoginPacket.payload = password;
    
    LoginPacket.encode();
    
    console.log(LoginPacket);
    
    this.socket.writePacket(LoginPacket);
  }
  
  handle(message) {
    
  }
  
  send(payload) {
    if (this.loggedIn === "false") return this.console.error("You are not logged in, please try again later.");
    
    let CommandPacket = this.packetPool.get("Command");
    CommandPacket = new CommandPacket();
    
    CommandPacket.payload = payload;
    
    CommandPacket.encode();
    
    console.log(CommandPacket);
    
    this.socket.writePacket(CommandPacket);
  }
};

module.exports = RCON;