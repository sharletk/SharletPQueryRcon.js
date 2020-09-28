const { Query } = require("../../src/index.js");
const query = new Query();

query.connect(19132, "localhost").then((q) => {  
  q.getEmitter().on("data", (data) => console.log(data));
  
  q.execute();
}).catch(error => console.error(error));