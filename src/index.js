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
        const keyValue = parseKeyValueToObject(string)
        return keyValue
    } catch (e) {
        throw e
    }
    
}

function parseKeyValueToObject(string) {
    const stripped = string.replaceAll(/\r\n/g, "\n")
    const lines = stripped.split("\n")
    let objectAsArray = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const section = /^\[(.*)\]$/
        const comment = /;.*/

        if (!!line.match(comment) || line.trim() === '') {
            continue
        }

        if (!!line.match(section)) {
            const sectionName = line.match(section)[1]
            const sectionLines = []

            i++

            while (i < lines.length && !lines[i].match(section)) {
                sectionLines.push(lines[i])
                i++
            }

            i--

            const sectionObject = {}

            sectionLines.forEach((line) => {
                const [k, v] = parseLine(line, i)
                sectionObject[k] = v
            })

            objectAsArray.push([sectionName, sectionObject])
        } else {
            let splitLine = parseLine(line, i)

            if (objectAsArray.flat().includes(splitLine[0])) {
                throw new Error("Duplicate Key")
            }
            objectAsArray = [...objectAsArray, splitLine]
        }
    }
    return Object.fromEntries(objectAsArray)
}

function parseLine(line, index) {
    let splitLine = line.split("=")

    if (splitLine.length !== 2 || !splitLine) {
        throw new Error("Invalid key value pair at line " + (index + 1) + ": " + splitLine )
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

    return splitLine
}

export {readIni, readIniSync}