import {
  parseLinesIntoSections,
  parseSectionsIntoSubSections,
  parseStringIntoLines,
  parseSubSectionsIntoObject,
} from "./core.js";
import type {
  ParsedLine,
  ParsedLineType,
  ParsedSection,
  KeyValuePair,
  Section,
  EmptyLine,
  Comment,
  FullLineComment,
} from "./core.js";

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

export { iniToObject };

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
