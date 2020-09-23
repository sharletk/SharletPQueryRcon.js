const Socket = require("../Socket/Socket.js");

class Query {
  constructor() {
    this._socket;
    this._packets = new Map();
    this._connected = false;
    
    this._init();
  }
  
  _initializePackets() {
    const RequestPacket = require("./Packet/packets/RequestPacket.js");
    this._packets.set("RequestPacket", new RequestPacket());
    
    const ResponsePacket = require("./Packet/packets/ResponsePacket.js");
    this._packets.set("ResponsePacket", new ResponsePacket());
    
    const BasicRequestPacket = require("./Packet/packets/BasicRequestPacket.js");
    this._packets.set("BasicRequestPacket", new BasicRequestPacket());
    
    const BasicResponsePacket = require("./Packet/packets/BasicResponsePacket.js");
    this._packets.set("BasicResponsePacket", new BasicResponsePacket());
  }
  
  async _init() {
    await this._initializePackets();
    this._socket = await (new Socket());
    await this._socket.createSocket();
    
    this._socket.getSocket().on("message", (message, rinfo) => {
      this._dataParser(message, rinfo);
    });
  }
  
  async connect(port, address) {
    await this._socket.connect(port, address);
    this._connected = true;
  }
    
  async query(port, address) {
    if (!(this._connected)) return console.error("Please connect to a address.");
    
    let RequestPacket = this._packets.get("RequestPacket");
    await RequestPacket.setSessionID(RequestPacket._generateSessionID());
    await RequestPacket.encode();
    console.log(RequestPacket)
    await this._socket.sendData(RequestPacket.getBuffer());
  }
}

module.exports = Query;