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
import { parseObjectLineToString } from "./objectparse.js";

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

function objectToIni(
  object: Object,
  newline: string = "\n"
): string {
  let str = "";

  for (const [key, value] of Object.entries(object)) {
    str += parseObjectLineToString(key, value, newline);
  }

  return str;
}

export { iniToObject, objectToIni };

export type {
  ParsedLine,
  ParsedLineType,
  ParsedSection,
  KeyValuePair,
  Section,
  EmptyLine,
  Comment,
  FullLineComment
};
