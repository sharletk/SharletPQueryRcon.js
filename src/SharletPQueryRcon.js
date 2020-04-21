"use strict";

const Console = require("./console/Console.js");

const Query = require("./query/Query.js");
const RCON = require("./rcon/RCON.js");

class SharletPQueryRcon {
  constructor() {
    this.console = new Console();
    
    this.QueryClient = new Query(this.console);
    this.RconClient = new RCON(this.console);
  }
};

module.exports = SharletPQueryRcon;