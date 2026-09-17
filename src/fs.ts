import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import * as os from "node:os";
import { parseLinesIntoSections, parseSectionsIntoSubSections, parseStringIntoLines, parseSubSectionsIntoObject } from "./stringparse.js";
import { objectToIni } from "./index.js";
import { parseIndividualSectionToString } from "./objectparse.js";

async function iniFileToObject(infile: fsSync.PathLike): Promise<object | null> {
  try {
    const file = await fs.readFile(infile, {encoding: "utf8"})
    const lines = parseStringIntoLines(file)
    const sections = parseLinesIntoSections(lines)
    const subsections = parseSectionsIntoSubSections(sections)
    if (subsections) {
      const object = parseSubSectionsIntoObject(subsections)
      return object
    }
    return null
  } catch (error) {
    throw error
  }
}

function iniFileToObjectSync(infile: fsSync.PathLike): object | null {
  try {
    const file = fsSync.readFileSync(infile, {encoding: "utf8"})
    const lines = parseStringIntoLines(file)
    const sections = parseLinesIntoSections(lines)
    const subsections = parseSectionsIntoSubSections(sections)
    
    if (subsections) {
      parseIndividualSectionToString(subsections)
      const object = parseSubSectionsIntoObject(subsections)
      return object
    }
    return null
  } catch (error) {
    throw error
  }
}

async function iniFileToJSONFile(infile: fsSync.PathLike, outfile: fsSync.PathLike): Promise<void> {
  try {
    await fs.writeFile(outfile, JSON.stringify(await iniFileToObject(infile)))
  } catch (error) {
    throw error
  }
}

function iniFileToJSONFileSync(infile: fsSync.PathLike, outfile: fsSync.PathLike): void {
  try {
    fsSync.writeFileSync(outfile, JSON.stringify(iniFileToObjectSync(infile)))
  } catch (error) {
    throw error
  }
}

async function objectToIniFile(outfile: fsSync.PathLike, object: Object): Promise<void> {
  try {
    await fs.writeFile(outfile, objectToIni(object, os.EOL))
  } catch (error) {
    throw error
  }
}

function objectToIniFileSync(outfile: fsSync.PathLike, object: Object): void {
  try {
    fsSync.writeFileSync(outfile, objectToIni(object, os.EOL))
  } catch (error) {
    throw error
  }
}

export { iniFileToObject, iniFileToObjectSync, iniFileToJSONFile, iniFileToJSONFileSync, objectToIniFile, objectToIniFileSync };
