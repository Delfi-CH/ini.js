import { readFileSync, writeFileSync} from 'fs';

import {readFile, writeFile} from 'fs/promises'; 

function readIniSync(filepath) {
    try {
        const data = readFileSync(filepath, 'utf8')
        return iniToObject(data)
    }
    catch (e) {
        throw e
    }
}

async function readIni(filepath) {
    try {
        const data = await readFile(filepath, 'utf8')
        return iniToObject(data)
    }
    catch (e) {
        throw e
    }
}

function iniToObject(string) {
    try {
        const rawKeyValue = parseStringToRawKeyValue(string)
        const keyValue = parseKeyValueToObject(rawKeyValue)
        return keyValue
    } catch (e) {
        throw e
    }
    
}

function parseStringToRawKeyValue(string) {
    const stripped = string.replaceAll(/\r\n/g, "\n")
    const linesWithComments = stripped.split("\n")

    let lines = linesWithComments.map((line)=>{
        const comment = /;.*/
        return line.replace(comment, "")
    })
    lines = lines.filter((line)=> line !== '')

    return lines
}

function parseKeyValueToObject(lines) {
    let objectAsArray = []
    lines.forEach((line)=> {
        let splitLine = line.split("=")

        if (objectAsArray.flat().includes(splitLine[0])) {
            throw new Error("Duplicate Key")
        }

        if (splitLine.length !== 2 || !splitLine) {
             throw new Error("Invalid key value pair")
        }

        if (!isNaN(Number(splitLine[1]))) {
            splitLine[1] = Number(splitLine[1])
        }

        if (splitLine[1].toString().trim() === "true") {
            splitLine[1] = true
        } else if (splitLine[1].toString().trim() === "false" ) {
            splitLine[1] = false
        }
        
        if (splitLine[1].toString().startsWith("\"") && splitLine[1].toString().endsWith("\"")) {
            splitLine[1] = splitLine[1].slice(1)
            splitLine[1] = splitLine[1].slice(0, -1)
        }

        objectAsArray = [...objectAsArray, splitLine]
    })
    return Object.fromEntries(objectAsArray)
}

export {readIni, readIniSync}