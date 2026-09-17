import { iniFileToObject, iniFileToObjectSync } from "../src/fs.js";
import * as fs from "node:fs/promises";
import { parseLinesIntoSections, parseSectionsIntoSubSections, parseStringIntoLines, parseSubSectionsIntoObject } from "../src/stringparse.js"
import { objectToIni } from "../src/index.js";
import { parseIndividualSectionToString } from "../src/objectparse.js";

const demoObject = {
    key: "value",
    number : 123,
    bool: true,
    array: [1,2,3,4,5],
    array2: [true, 42.00, "hello,world"],
    system: {
        type: "unix",
        linux: true,
        compilers: {
            cCompiler: "gcc",
            'c++Compiler': "g++"
        }
    }
}

try {
    console.log("Async parsing of valid file was sucessfull:")
    console.log(await iniFileToObject("data/example.ini"))
} catch (err) {
    console.error("Async parsing of valid file failed!: " + err)
}

try {
    console.error("Async parsing of invalid file was sucessfull!:" + await iniFileToObject("data/incorrect.ini"))
} catch (err) {
    console.log("Async parsing of invalid file failed: "+ err)
}

try {
    console.log("Sync parsing of valid file was sucessfull:")
    console.log(iniFileToObjectSync("data/example.ini"))
} catch (err) {
    console.error("Sync parsing of valid file failed!: " + err)
}

try {
    console.error("Sync parsing of invalid file was sucessfull!:" + iniFileToObjectSync("data/incorrect.ini"))
} catch (err) {
    console.log("Sync parsing of invalid file failed: "+ err)
}

try {
    console.log("Parsing of object was sucessfull")
    console.log( objectToIni(demoObject))
} catch (err) {
    console.error(err)
}

try {
    const file = await fs.readFile("data/example.ini", {encoding: "utf8"})
    const lines = parseStringIntoLines(file)
    const sections = parseLinesIntoSections(lines)
    const subsections = parseSectionsIntoSubSections(sections)
    
    if (subsections) {
      console.log(parseIndividualSectionToString(subsections))
    }
  } catch (error) {
    throw error
  }
