/**
 *
 *
 *
 * ╭━━━┳╮╱╱╱╱╱╱╭╮╱╱╱╭╮╭━━━╮
 * ┃╭━╮┃┃╱╱╱╱╱╱┃┃╱╱╭╯╰┫╭━╮┃
 * ┃╰━━┫╰━┳━━┳━┫┃╭━┻╮╭┫╰━╯┃
 * ╰━━╮┃╭╮┃╭╮┃╭┫┃┃┃━┫┃┃╭━━╯
 * ┃╰━╯┃┃┃┃╭╮┃┃┃╰┫┃━┫╰┫┃
 * ╰━━━┻╯╰┻╯╰┻╯╰━┻━━┻━┻╯
 *
 *
 *
 *  @author SharletP
 *   @file index.js
 *   (c) ALL RIGHTS RESERVED.
 *
*/

"use strict";

let processVersion = process.version.slice(1).split(".")[0];
let requiredVersion = 10;

if (processVersion < requiredVersion) throw new Error(`••• NODE VERSION MANAGER •••\n >>> You are using node version ${processVersion} which is not compatible, please use a version of ${requiredVersion} or higher.`);

module.exports = {
  "Query": require("./Query/Query.js"),
  "Rcon": require("./Rcon/Rcon.js")
};