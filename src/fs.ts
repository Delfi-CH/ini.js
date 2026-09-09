import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import { parseLine, parseLinesIntoSections, parseSectionsIntoSubSections, parseStringIntoLines, parseSubSectionsIntoObject, type ParsedLine } from "./core.js";

async function iniToObjectReadline(filename: fsSync.PathLike): Promise<object | null> {
  try {
  const file = await fs.open(filename);
  let lines: ParsedLine[] = [];
  let lineIDs: Set<String> = new Set();
  for await (const line of file.readLines()) {
    try {
      const parsed = parseLine(line);
      if (parsed === undefined) {
        continue
      }
      if (!lineIDs.has(parsed.id)) {
        lines = [...lines, parsed]
        lineIDs.add(parsed.id)
      } else {
        throw new Error(`Duplicate Key!: ${parsed.id}`)
      }
    } catch (error) {
      throw error;
    }
  }
  //console.log(lines)
  return null;
  } catch (error) {
    throw error
  }
}

async function iniToObject(filename: fsSync.PathLike): Promise<object | null> {
  try {
    const file = await fs.readFile(filename, {encoding: "utf8"})
    const lines = parseStringIntoLines(file)
    const sections = parseLinesIntoSections(lines)
    const subsections = parseSectionsIntoSubSections(sections)
    if (subsections) {
      const object = parseSubSectionsIntoObject(subsections)
      fs.writeFile("data/out.json", JSON.stringify(object))
    }
    return null
  } catch (error) {
    throw error
  }
}

export { iniToObject };
