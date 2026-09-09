import { iniFileToObject } from "../src/public/fs.js";

console.log(await iniToObject("data/example.ini"))
//await iniToObject("data/incorrect.ini")