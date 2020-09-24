const Socket = require("../Socket/Socket.js");
const BinaryStream = require("../BinaryStream/BinaryStream.js");

class Query {
  constructor() {
    this._socket;
    this._packets = new Map();
    this._connected = false;
    this._statType;
    
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
    
  async query(port, address, statType) {
    if (!(this._connected)) return console.error("Please connect to a address.");
    
    if (typeof statType === "undefined" || statType === null) statType = "full";
    
    if (statType !== "basic" || statType !== "full") statType = "full";
    
    this._statType = "basic";    
    
    let RequestPacket = this._packets.get("RequestPacket");
    
    await RequestPacket.setSessionID(RequestPacket._generateSessionID());
    await RequestPacket.encode();
    console.log(RequestPacket)
    await this._socket.sendData(RequestPacket.getBuffer());
  }
  
  async _dataParser(message, rinfo) {
    console.log(message);
    let binstream = new BinaryStream();
    binstream.setBuffer(message);
    
    const type = binstream.readByte();
    if (type == 0x00) {
      if (this._statType == "basic") {
        let BasicResponsePacket = this._packets.get("BasicResponsePacket");
        
        await BasicResponsePacket.setBuffer(message);
        await BasicResponsePacket.decode();
        
        let payload = BasicResponsePacket.getPayload();
        
        return {
          "motd": payload[0],
          "gametype": payload[1],
          "map": payload[2],
          "numplayers": payload[3],
          "maxplayers": payload[4],
          "hostport": payload[5],
          "hostip": payload[6]
        };
      } else if (this._statType == "full") {
        
      } else {
        return;
      }
    } else if (type == 0x09) {
      let ResponsePacket = this._packets.get("ResponsePacket");
      
      await ResponsePacket.setBuffer(message);
      await ResponsePacket.decode();
      console.log(ResponsePacket);
      
      let sessionID = await ResponsePacket.getSessionID();
      let token = await ResponsePacket.getToken();
      
      let BasicRequestPacket = this._packets.get("BasicRequestPacket");
      
      await BasicRequestPacket.setSessionID(sessionID);
      await BasicRequestPacket.setToken(token);
      await BasicRequestPacket.encode();
      
      console.log(BasicRequestPacket);
      
      await this._socket.sendData(BasicRequestPacket.getBuffer());
    } else {
      return;
    }
  }
}

module.exports = Query;