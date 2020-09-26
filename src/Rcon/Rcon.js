const Socket = require("../Socket/TCP/Socket.js");
const BinaryStream = require("../BinaryStream/BinaryStream.js");

class Rcon {
  constructor() {
    this._socket;
    this._packets = new Map();
    this._connected = false;
    
    this._loggedIn = false;
    
    this._data = null;
    this._recieved = false;
    
    this._init();
    
    this.__password;
    this._command;
  }
  
  _initializePackets() {
    const LoginPacket = require("./Packet/packets/LoginPacket.js");
    this._packets.set("LoginPacket", new LoginPacket());
    
    const LoginResponsePacket = require("./Packet/packets/LoginResponsePacket.js");
    this._packets.set("LoginResponsePacket", new LoginResponsePacket());
    
    const CommandPacket = require("./Packet/packets/CommandPacket.js");
    this._packets.set("CommandPacket", new CommandPacket());
    
    const CommandResponsePacket = require("./Packet/packets/CommandResponsePacket.js");
    this._packets.set("CommandResponsePacket", new CommandResponsePacket());
  }
  
  async _init() {
    this._socket = await (new Socket());
    await this._socket.createSocket();
    
    this._socket.getSocket().on("data", (data) => {
      this._dataParser(data);
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
  
  setPassword(password) {
    this.__password = password;
  }
  
  getCommand() {
    return this._command;
  }
  
  setCommand(command) {
    this._command = command;
  }
  
  getData() {
    return this._data;
  }
  
  async execute() {
    await this._initializePackets();
    
    let LoginPacket = this._packets.get("LoginPacket");
    
    await LoginPacket.setRequestID(LoginPacket._generateRequestID());
    await LoginPacket.setPayload(this.__password);  
    await LoginPacket.encode();
    console.log(LoginPacket);
    await this._socket.sendData(LoginPacket.getBuffer());
  }
  
  async _dataParser(data) {
    console.log(data);
    let binstream = new BinaryStream();
    binstream.setBuffer(data);
    
    binstream.setOffset(8);
    const type = binstream.readLInt();
    
    if (type == 0x02) {
      let LoginResponsePacket = this._packets.get("LoginResponsePacket");
      
      await LoginResponsePacket.setBuffer(data);
      await LoginResponsePacket.decode();
      
      console.log(LoginResponsePacket);
      
      let requestID = await LoginResponsePacket.getRequestID();
      
      if (requestID == -1) return console.error("Authentication Failed.");
      
      let CommandPacket = this._packets.get("CommandPacket");
      
      await CommandPacket.setRequestID(requestID);
      await CommandPacket.setPayload(this._command);
      await CommandPacket.encode();      
      console.log(CommandPacket);      
      await this._socket.sendData(CommandPacket.getBuffer());      
    } else if (type == 0x00) {
      let CommandResponsePacket = this._packets.get("CommandResponsePacket");
      
      await CommandResponsePacket.setBuffer(data);
      await CommandResponsePacket.decode();
      
      this._data = await CommandResponsePacket.getPayload();
      
      console.log(CommandResponsePacket);
      
      await this.disconnect();
    } else {
      return;
    }
  }
}

module.exports = Rcon;