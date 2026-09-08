const comment = /(;|#)/;
const sectionHeader = /\[.*]/;

enum ParsedLineType {
  KeyValuePair = "KeyValuePair",
  FullLineComment = "FullLineComment",
  Section = "Section",
  Empty = "Empty",
}

interface ParsedLine {
  type: ParsedLineType;
  id: string;
  content: KeyValuePair | Section | FullLineComment | EmptyLine;
}

interface KeyValuePair {
  key: string;
  value: string | number | boolean | (string | number | boolean)[];
  inlineComment?: Comment;
}

interface Section {
  name: string;
  subsection: Section;
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
      throw new Error("Invalid key value pair!");
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
  }
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

  if (!isNaN(+value)) {
    // @ts-ignore this is a KeyValuePair, womp womp
    return +value;

    // Booleans
  } else if (str2bool(value) !== undefined) {
    // @ts-ignore this is a KeyValuePair, womp womp
    return str2bool(value);
  } else {
    return value;
  }
}

function genID(): string {
  const rand = String(Math.floor(Math.random() * 8192));
  return fnv_1a(rand)
}

function fnv_1a(string: string): string {
  let hash = 2166136261;
  for (let i = 0; i < string.length; i++) {
    hash ^= string.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

export { parseLine, type ParsedLine };
