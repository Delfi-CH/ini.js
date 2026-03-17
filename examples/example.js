import { readIni, writeIni, readIniSync, writeIniSync } from "ini.js/fs";
import { iniStringToObject } from "ini.js"

/* CommonJS Imports
const { readIni, writeIni, readIniSync, writeIniSync } = require("ini.js/fs") 
const { iniStringToObject } = require("ini.js")
*/

// synchronous examples

function start() {
    let config = readIniSync("examples/config.ini")

    console.log(`Database connection: ${config.database.address}`)
    console.log(`Starting App at Port ${config.port} with auth=${config.auth}`)

    config.laststarted = new Date().toISOString()

    writeIniSync("examples/config_new.ini", config)

    console.log(`Started at: ${readIniSync("examples/config.ini").laststarted}`)
}

start()

// asynchronous examples

async function asyncStart(params) {
    let config = await readIni("examples/config.ini")

    console.log(`Database connection: ${config.database.address}`)
    console.log(`Starting App at Port ${config.port} with auth=${config.auth}`)

    config.laststarted = new Date().toISOString()

    await writeIni("examples/config_new.ini", config)

    const startedAt = await readIni("examples/config.ini")

    console.log(`Started at: ${startedAt.laststarted}`)
}

asyncStart()

// no fs example

function stringToObject() {
    const string = "key=value\ncool=yes"
    const object = iniStringToObject(string)
    console.log("cool: " + object.cool)
}

stringToObject()