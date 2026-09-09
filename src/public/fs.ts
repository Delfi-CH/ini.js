import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import { parseLinesIntoSections, parseSectionsIntoSubSections, parseStringIntoLines, parseSubSectionsIntoObject } from "../core.js";

async function iniFileToObject(filename: fsSync.PathLike): Promise<object | null> {
  try {
    const file = await fs.readFile(filename, {encoding: "utf8"})
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

export { iniFileToObject };
