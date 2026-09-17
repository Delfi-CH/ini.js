import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import * as os from "node:os";
import {
  parseLinesIntoSections,
  parseSectionsIntoSubSections,
  parseStringIntoLines,
  parseSubSectionsIntoObject,
  type Section,
} from "./stringparse.js";
import { objectToIni, syntaxTreeToIni } from "./index.js";
import { parseIndividualSectionToString } from "./objectparse.js";

/**
 * Asynchronous reading of a file from disk and parsing into a plain JavaScript Object.
 *
 * Throws execptions for file reading and parsing
 * @param infile Path to the file to be read
 * @returns A promise containing a parsed object or null
 */
async function iniFileToObject(
  infile: fsSync.PathLike,
): Promise<object | null> {
  try {
    const file = await fs.readFile(infile, { encoding: "utf8" });
    const lines = parseStringIntoLines(file);
    const sections = parseLinesIntoSections(lines);
    const subsections = parseSectionsIntoSubSections(sections);
    if (subsections) {
      const object = parseSubSectionsIntoObject(subsections);
      return object;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Synchronous reading of a file from disk and parsing into a plain JavaScript Object.
 *
 * Throws execptions for file reading and parsing
 * @param infile Path to the file to be read
 * @returns A parsed object or null
 */
function iniFileToObjectSync(infile: fsSync.PathLike): object | null {
  try {
    const file = fsSync.readFileSync(infile, { encoding: "utf8" });
    const lines = parseStringIntoLines(file);
    const sections = parseLinesIntoSections(lines);
    const subsections = parseSectionsIntoSubSections(sections);

    if (subsections) {
      parseIndividualSectionToString(subsections);
      const object = parseSubSectionsIntoObject(subsections);
      return object;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Asynchronous reading of a file from disk and parsing into a syntax tree.
 *
 * Throws execptions for file reading and parsing
 * @param infile Path to the file to be read
 * @returns A promise containing a syntax tree or null
 */
async function iniFileToSyntaxTree(
  infile: fsSync.PathLike,
): Promise<Section | null> {
  try {
    const file = await fs.readFile(infile, { encoding: "utf8" });
    const lines = parseStringIntoLines(file);
    const sections = parseLinesIntoSections(lines);
    const subsections = parseSectionsIntoSubSections(sections);
    if (subsections) {
      return subsections;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Synchronous reading of a file from disk and parsing into a syntax tree.
 *
 * Throws execptions for file reading and parsing
 * @param infile Path to the file to be read
 * @returns A promise containing a syntax tree or null
 */
function iniFileToSyntaxTreeSync(infile: fsSync.PathLike): Section | null {
  try {
    const file = fsSync.readFileSync(infile, { encoding: "utf8" });
    const lines = parseStringIntoLines(file);
    const sections = parseLinesIntoSections(lines);
    const subsections = parseSectionsIntoSubSections(sections);

    if (subsections) {
      return subsections;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Asynchronous reading of a file from disk, parsing into a JavaScript object, and writing the results to a json file.
 *
 * Throws execptions for file reading, writing and parsing
 * @param infile Path to the file to be read
 * @param outfile Path to the output file
 */
async function iniFileToJSONFile(
  infile: fsSync.PathLike,
  outfile: fsSync.PathLike,
): Promise<void> {
  try {
    await fs.writeFile(
      outfile,
      JSON.stringify(await iniFileToObject(infile), null, 2),
      { encoding: "utf-8" },
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Synchronous reading of a file from disk, parsing into a JavaScript object, and writing the results to a json file.
 *
 * Throws execptions for file reading, writing and parsing
 * @param infile Path to the file to be read
 * @param outfile Path to the output file
 */
function iniFileToJSONFileSync(
  infile: fsSync.PathLike,
  outfile: fsSync.PathLike,
): void {
  try {
    fsSync.writeFileSync(
      outfile,
      JSON.stringify(iniFileToObjectSync(infile), null, 2),
      { encoding: "utf-8" },
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Asynchronous parsing of an object and writing it to an output file.
 *
 * Throws execptions for file writing and parsing
 * @param outfile Path to the output file
 * @param object Object to be parsed
 */
async function objectToIniFile(
  outfile: fsSync.PathLike,
  object: Object,
): Promise<void> {
  try {
    await fs.writeFile(outfile, objectToIni(object, os.EOL));
  } catch (error) {
    throw error;
  }
}

/**
 * Synchronous parsing of an object and writing it to an output file.
 *
 * Throws execptions for file writing and parsing
 * @param outfile Path to the output file
 * @param object Object to be parsed
 */
function objectToIniFileSync(outfile: fsSync.PathLike, object: Object): void {
  try {
    fsSync.writeFileSync(outfile, objectToIni(object, os.EOL));
  } catch (error) {
    throw error;
  }
}

/**
 * Asynchronous parsing of a syntax tree and writing it to an output file.
 *
 * Throws execptions for file writing and parsing
 * @param outfile Path to the output file
 * @param tree Syntax tree to be parsed
 */
async function syntaxTreeToIniFile(
  outfile: fsSync.PathLike,
  tree: Section,
): Promise<void> {
  try {
    await fs.writeFile(outfile, syntaxTreeToIni(tree, os.EOL), {
      encoding: "utf-8",
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Synchronous parsing of a syntax tree and writing it to an output file.
 *
 * Throws execptions for file writing and parsing
 * @param outfile Path to the output file
 * @param tree Syntax tree to be parsed
 */
function syntaxTreeToIniFileSync(
  outfile: fsSync.PathLike,
  tree: Section,
): void {
  try {
    fsSync.writeFileSync(outfile, syntaxTreeToIni(tree, os.EOL), {
      encoding: "utf-8",
    });
  } catch (error) {
    throw error;
  }
}

export {
  iniFileToObject,
  iniFileToObjectSync,
  iniFileToSyntaxTree,
  iniFileToSyntaxTreeSync,
  iniFileToJSONFile,
  iniFileToJSONFileSync,
  objectToIniFile,
  objectToIniFileSync,
  syntaxTreeToIniFile,
  syntaxTreeToIniFileSync,
};
