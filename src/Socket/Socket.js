const dgram = require("dgram");

class Socket {
  constructor() {
    this._socket;
  }
  
  getSocket() {
    return this._socket;
  }
  
  getAddress() {
    return this._socket.address();
  }
  
  getRemoteAddress() {
    return this._socket.remoteAddress();
  }
  
  async createSocket() {
    this._socket = await dgram.createSocket("udp4");
    
    this._socket.on("error", (error) => {
      console.error(error);
      this._socket.close();
    });
    
    this._socket.on("listening", () => {
      let address = this._socket.address();
      console.info(`Listening on ${address.address}:${address.port} [${address.family}]`);
    });
    
    this._socket.on("connect", () => {
      console.debug("Successfull socket connection established to the address.");
    });
    
    this._socket.on("disconnect", () => {
      console.alert("Successfull socket disconnect from the address.");
    });
  }
  
  async destroySocket() {    
    return this._socket.close();
  }
  
  async connect(port, address) {    
    await this._socket.connect(port, address);
  }
  
  async disconnect() {    
    await this._socket.disconnect();
  }  
  
  async sendData(buffer) {    
    return this._socket.send(buffer, this.getRemoteAddress().port, this.getRemoteAddress().address);
  }
}

module.exports = Socket;