import { iniFileToObject } from "../src/public/fs.js";

try {
    console.log("Parsing of valid file was sucessfull:")
    console.log(await iniFileToObject("data/example.ini"))
} catch (err) {
    console.error("Parsing of valid file failed!: " + err)
}

try {
    console.error("Parsing of invalid file was sucessfull!:" + await iniFileToObject("data/incorrect.ini"))
} catch (err) {
    console.log("Parsing of invalid file failed: "+ err)
}