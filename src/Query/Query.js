const Socket = require("../Socket/Socket.js");
const BinaryStream = require("../BinaryStream/BinaryStream.js");

class Query {
  constructor() {
    this._socket;
    this._packets = new Map();
    this._connected = false;
    this._statType;
    
    this._data = null;
    this._recieved = false;
    
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
    
    const FullRequestPacket = require("./Packet/packets/FullRequestPacket.js");
    this._packets.set("FullRequestPacket", new FullRequestPacket());
    
    const FullResponsePacket = require("./Packet/packets/FullResponsePacket.js");
    this._packets.set("FullResponsePacket", new FullResponsePacket());
  }
  
  async _init() {
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
  
  async disconnect() {
    await this._socket.disconnect();
    this._connected = false;
  }
  
  async destroy() {
    await this._socket.destroySocket();
    this._connected = false;
  }
  
  getData() {
    return this._data;
  }
    
  async query(statType) {
    if (!(this._connected)) return console.error("Please connect to a address.");
    
    await this._initializePackets();
    
    if (typeof statType === "undefined" || statType === null) statType = "full";
    
    if (statType !== "basic" && statType !== "full") statType = "full";
    
    this._statType = statType;    
    
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
        
        await BasicResponsePacket.write(message);
        await BasicResponsePacket.rewind();
        await BasicResponsePacket.decode();
        
        let payload = await BasicResponsePacket.getPayload();
        
        this._data = {
          "motd": payload[0],
          "gametype": payload[1],
          "map": payload[2],
          "numplayers": payload[3],
          "maxplayers": payload[4],
          "hostport": payload[5],
          "hostip": payload[6]
        };
      } else if (this._statType == "full") {
        let FullResponsePacket = this._packets.get("FullResponsePacket");
        
        await FullResponsePacket.write(message);
        await FullResponsePacket.rewind();
        await FullResponsePacket.decode();
        
        let payload = await FullResponsePacket.getPayload();
        
        this._data = {
          "hostname": payload[1],
          "game_type": payload[3],
          "game_id": payload[5],
          "version": payload[7],
          "plugins": payload[9],
          "map": payload[11],
          "numplayers": payload[13],
          "maxplayers": payload[15],
          "hostport": payload[17],
          "hostip": payload[19],
          "players": payload[20]
        };
      } else {
        return;
      }
      
      await this.disconnect();
    } else if (type == 0x09) {
      let ResponsePacket = this._packets.get("ResponsePacket");
      
      await ResponsePacket.write(message);
      await ResponsePacket.rewind();
      await ResponsePacket.decode();
      console.log(ResponsePacket);
      
      let sessionID = await ResponsePacket.getSessionID();
      let token = await ResponsePacket.getToken();
      
      if (this._statType == "basic") {
        let BasicRequestPacket = this._packets.get("BasicRequestPacket");
      
        await BasicRequestPacket.setSessionID(sessionID);
        await BasicRequestPacket.setToken(token);
        await BasicRequestPacket.encode();
      
        console.log(BasicRequestPacket);
      
        await this._socket.sendData(BasicRequestPacket.getBuffer());
      } else if (this._statType == "full") {
        let FullRequestPacket = this._packets.get("FullRequestPacket");
      
        await FullRequestPacket.setSessionID(sessionID);
        await FullRequestPacket.setToken(token);
        await FullRequestPacket.encode();
      
        console.log(FullRequestPacket);
      
        await this._socket.sendData(FullRequestPacket.getBuffer());
      } else {
        return;
      }            
    } else {
      return;
    }
  }
}

module.exports = Query;