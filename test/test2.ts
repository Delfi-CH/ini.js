import * as fs from "node:fs/promises";
import {
  parseLinesIntoSections,
  parseSectionsIntoSubSections,
  parseStringIntoLines,
  parseSubSectionsIntoObject,
} from "../src/stringparse.js";
import { parseIndividualSectionToString } from "../src/objectparse.js";

try {
  const file = await fs.readFile("data/example.ini", { encoding: "utf8" });
  const lines = parseStringIntoLines(file);
  const sections = parseLinesIntoSections(lines);
  const subsections = parseSectionsIntoSubSections(sections);

  if (subsections) {
    console.log(parseIndividualSectionToString(subsections));
  }
} catch (error) {
  throw error;
}
