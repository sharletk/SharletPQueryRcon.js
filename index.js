"use strict";

let processVersion = process.version.slice(1).split(".")[0];
let requiredVersion = 12;

if (processVersion < requiredVersion) throw new Error(`NODE VERSION INCOMPATIBLE\n You are using node version ${processVersion} which is not compatible, please use a version of ${requiredVersion} or higher.`);

const SharletPQueryRcon = require("./src/SharletPQueryRcon.js");
const Client = new SharletPQueryRcon();