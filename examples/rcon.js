const { Rcon } = require("../src/index.js");
const rcon = new Rcon();

rcon.setPassword("sharletp");
rcon.setCommand("time set 0");
rcon.connect(19132, "localhost").then((r) => {  
  r.getEmitter().on("data", (data) => !(data.length > 1) ? console.log("Command successfully executed") : console.error(data));
  
  r.execute();
}).catch(error => console.error(error));