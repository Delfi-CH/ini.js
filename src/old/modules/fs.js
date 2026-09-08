import { readFileSync, writeFileSync} from 'fs';

import {readFile, writeFile} from 'fs/promises'; 

import { iniStringToObject, objectToIniString } from "./core.js"

function readIniSync(filepath) {
    try {
        const data = readFileSync(filepath, 'utf8')
        return iniStringToObject(data)
    }
    catch (e) {
        throw e
    }
}

async function readIni(filepath) {
    try {
        const data = await readFile(filepath, 'utf8')
        return iniStringToObject(data)
    }
    catch (e) {
        throw e
    }
}

function writeIniSync(filepath, object) {
    const string = objectToIniString(object)

    try {
        writeFileSync(filepath  , string, 'utf8')
    }
    catch (e) {
        throw e
    }
}

async function writeIni(filepath, object) {
    const string = objectToIniString(object)

    try {
        await writeFile(filepath  , string, 'utf8')
    }
    catch (e) {
        throw e
    }
}

export {readIni, readIniSync, writeIniSync, writeIni}