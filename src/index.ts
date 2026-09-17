import {
  parseLinesIntoSections,
  parseSectionsIntoSubSections,
  parseStringIntoLines,
  parseSubSectionsIntoObject,
} from "./stringparse.js";
import type {
  ParsedLine,
  ParsedLineType,
  ParsedSection,
  KeyValuePair,
  Section,
  EmptyLine,
  Comment,
  FullLineComment,
} from "./stringparse.js";
import {
  parseIndividualSectionToString,
  parseObjectLineToString,
} from "./objectparse.js";

/**
 * Turns a string into a plain JavaScript object.
 * Each line must be seperated by either a \n, \r or \r\n
 *
 * Throws an execption if the string contains illegal syntax
 *
 * @param string The input string
 * @returns A parsed object or null
 */
function iniToObject(string: string): object | null {
  try {
    const lines = parseStringIntoLines(string);
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
 * Turns a string into a syntax tree object..
 * Each line must be seperated by either a \n, \r or \r\n
 *
 * Throws an execption if the string contains illegal syntax
 *
 * @param string The input string
 * @returns The root section with lines and subsections, or null
 */
function iniToSyntaxTree(string: string): Section | null {
  try {
    const lines = parseStringIntoLines(string);
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
 * Turns a syntax tree into a string, seperated by newline character(s)
 *
 * @param section The syntax tree
 * @param lineFeed The newline characters to use (default \n). On Microsoft Windows, this should be set to \r\n
 * @returns A string in the ini file format
 */
function syntaxTreeToIni(section: Section, lineFeed: string = "\n"): string {
  return parseIndividualSectionToString(section, lineFeed);
}

/**
 * Turns a plain JavaScript object into a string, seperated by newline character(s)
 *
 * @param object The JavaScript Object
 * @param lineFeed The newline characters to use (default \n). On Microsoft Windows, this should be set to \r\n
 * @returns A string in the ini file format
 */
function objectToIni(object: Object, newline: string = "\n"): string {
  let str = "";

  for (const [key, value] of Object.entries(object)) {
    str += parseObjectLineToString(key, value, newline);
  }

  return str;
}

export { iniToObject, objectToIni, iniToSyntaxTree, syntaxTreeToIni };

export type {
  ParsedLine,
  ParsedLineType,
  ParsedSection,
  KeyValuePair,
  Section,
  EmptyLine,
  Comment,
  FullLineComment,
};
