const { Query } = require("../src/index.js");
const query = new Query();

query.connect(19132, "localhost").then((q)=> {  
  q.query().getData();
}).catch(error => console.error(error));