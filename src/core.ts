const comment = /(;|#)/;
const sectionHeader = /\[.*]/;

enum ParsedLineType {
  KeyValuePair = "KeyValuePair",
  FullLineComment = "FullLineComment",
  Section = "Section",
  Empty = "Empty",
}

interface Section {
  name: string;
  lines: ParsedLine[];
  subsections: Section[];
}

type iniFile = Section;

interface ParsedLine {
  type: ParsedLineType;
  id: string;
  content: KeyValuePair | ParsedSection | FullLineComment | EmptyLine;
}

interface KeyValuePair {
  key: string;
  value: string | number | boolean | (string | number | boolean)[];
  inlineComment?: Comment;
}

interface ParsedSection {
  name: string;
  inlineComment?: Comment;
}

interface EmptyLine {}

interface Comment {
  leadingCharacter: "#" | ";";
  content: string;
}

type FullLineComment = Comment;

function parseLine(line: string): ParsedLine | undefined {
  let split: string | string[] = line.split(comment);

  // Filter out fullline comments
  if (split.length === 1) {
    split = String(split[0]);
  } else if (split[0] === "" && (split[1] === ";" || split[1] === "#")) {
    return {
      type: ParsedLineType.FullLineComment,
      id: genID(),
      content: {
        leadingCharacter: split[1],
        content: split[2],
      },
    };
  } else {
    split = split.join("");
  }

  // Return empty lines
  if (split.trim() === "") {
    return {
      type: ParsedLineType.Empty,
      id: genID(),
      content: {},
    };

    // Check for KV-Pair
  } else if (split.includes("=")) {
    let kvp = split.split("=");
    if (kvp.length !== 2) {
      throw new Error("Invalid key value pair!: " + split);
    }
    let content: KeyValuePair = {
      key: String(kvp[0]),
      value: "tmp",
    };
    let returnable: ParsedLine = {
      type: ParsedLineType.KeyValuePair,
      id: String(kvp[0]),
      content: content,
    };

    let value: string | (string | number | boolean)[] = String(kvp[1]);
    if (value.trim() === "") {
      throw new Error("No value given!");
    }

    // check for inline comments
    let splitValue = value.split(comment);
    if (splitValue.length > 1) {
      const comment: Comment = {
        // @ts-ignore it can only be ; or #, womp womp
        leadingCharacter: String(splitValue[1]),
        comment: String(splitValue[2]),
      };
      // @ts-ignore this is a KeyValuePair, womp womp
      returnable.content.inlineComment = comment;
      value = String(splitValue[0]);
    }

    if (value.trim().startsWith("{") && value.trim().endsWith("}")) {
      value = value.slice(1, value.length - 1);
      value = value.split(",");

      value = value.map((individualValue) => {
        return parseValue(String(individualValue));
      });
      // @ts-ignore this is a KeyValuePair, womp womp
      returnable.content.value = value;
    } else {
      // @ts-ignore this is a KeyValuePair, womp womp
      returnable.content.value = parseValue(value);
    }

    return returnable;

    // Section parsing
  } else if (sectionHeader.test(split)) {
    let value = split.replace("[", "");
    value = value.replace("]", "");
    let localComment;

    // check for inline comments
    let splitValue = value.split(comment);
    if (splitValue.length > 1) {
      localComment = {
        // @ts-ignore it can only be ; or #, womp womp
        leadingCharacter: String(splitValue[1]),
        comment: String(splitValue[2]),
      };
      value = String(splitValue[0]);
    }
    let returnable: ParsedLine = {
      type: ParsedLineType.Section,
      id: `section.${value}`,
      content: {
        name: value,
      },
    };

    if (localComment) {
      // @ts-ignore this is a Section, womp womp
      returnable.content.inlineComment = localComment;
    }

    return returnable;
  }
}

function parseStringIntoLines(filedata: string): ParsedLine[] {
  const lines = filedata.split(/\r\n|\r|\n/);
  let parsedLines: ParsedLine[] = [];
  let lineIDs: Set<String> = new Set();
  for (const line of lines) {
    try {
      const parsed = parseLine(line);
      if (parsed === undefined) {
        continue;
      }
      if (!lineIDs.has(parsed.id)) {
        parsedLines = [...parsedLines, parsed];
        lineIDs.add(parsed.id);
      } else {
        throw new Error(`Duplicate Key!: ${parsed.id}`);
      }
    } catch (error) {
      throw error;
    }
  }
  return parsedLines;
}

function parseLinesIntoSections(lines: ParsedLine[]): Section[] {
  let sections: Section[] = [
    {
      name: "section",
      lines: [],
      subsections: [],
    },
  ];
  let currentSectionIndex = 0;
  for (const line of lines) {
    switch (line.type) {
      case ParsedLineType.KeyValuePair:
      case ParsedLineType.FullLineComment:
        // @ts-ignore womp womp
        sections[currentSectionIndex].lines = [
          // @ts-ignore womp womp
          ...sections[currentSectionIndex].lines,
          line,
        ];
        break;
      case ParsedLineType.Empty:
        // @ts-ignore womp womp
        sections[currentSectionIndex].lines = [
          // @ts-ignore womp womp
          ...sections[currentSectionIndex].lines,
          line,
        ];
        currentSectionIndex = 0;
        break;
      case ParsedLineType.Section:
        sections = [
          ...sections,
          {
            // @ts-ignore womp womp
            name: `section.${line.content.name}`,
            lines: [],
            subsections: [],
          },
        ];
        currentSectionIndex = sections.length - 1;
        break;
    }
  }
  return sections;
}

function parseSectionsIntoSubSections(sections: Section[]) {
  for (const section of sections) {
    const name = section.name.trim();
    const lastDot = name.lastIndexOf(".");
    if (lastDot === -1) {
      continue;
    }
    const parentName = name.slice(0, lastDot);
    const parentSection = sections.find((s) => s.name.trim() === parentName);
    if (parentSection) {
      parentSection.subsections = [...parentSection.subsections, section];
    }
  }
  return sections[0];
}

function parseSubSectionsIntoObject(section: Section): Object {
  let object = parseIndividualSectionToObject(section)
  for (const subsection of section.subsections) {
    // @ts-ignore womp womp
    object[subsection.name.split(".").at(-1)] = parseSubSectionsIntoObject(subsection)
  }
  
  return object
}

function parseIndividualSectionToObject(section: Section): Object {
  let object = {}
  if (section.lines.length >= 1) {
      section.lines.forEach((line)=>{
        if (line.type === ParsedLineType.KeyValuePair) {
          // @ts-ignore womp womp
          object[line.content.key] = line.content.value;
        }
    })
  }
  return object
}

function str2bool(string: string): boolean | undefined {
  switch (string) {
    case "true":
    case "True":
    case "TRUE":
      return true;
    case "false":
    case "False":
    case "FALSE":
      return false;
    default:
      return undefined;
  }
}

function parseValue(value: string): number | boolean | string {
  value = value.trim();
  if (value.startsWith("'") || value.startsWith('"')) {
    value = value.slice(1, value.length);
  }
  if (value.endsWith("'") || value.endsWith('"')) {
    value = value.slice(0, value.length - 1);
  }

  // parse Numbers
  if (!isNaN(+value)) {
    // @ts-ignore this is a KeyValuePair, womp womp
    return +value;

    // parse Booleans
  } else if (str2bool(value) !== undefined) {
    // @ts-ignore this is a KeyValuePair, womp womp
    return str2bool(value);
    // parse Strings
  } else {
    return value;
  }
}

function genID(): string {
  const rand = String(Math.floor(Math.random() * 8192));
  return fnv_1a(rand);
}

function fnv_1a(string: string): string {
  let hash = 2166136261;
  for (let i = 0; i < string.length; i++) {
    hash ^= string.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

export {
  parseLine,
  parseStringIntoLines,
  parseLinesIntoSections,
  parseSectionsIntoSubSections,
  parseSubSectionsIntoObject,
  type ParsedLine,
};
