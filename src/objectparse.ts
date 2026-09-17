import { ParsedLineType, type Section } from "./stringparse.js";

const kvTemplate = "key=value";
const arrayTemplate = "{values}";
const sectionTemplate = "[section]";

function parseObjectLineToString(
  key: string,
  value: any,
  newline: string = "\n",
  parentSection?: string,
): string {
  if (Array.isArray(value)) {
    const arr = arrayTemplate.replace("values", value.join(","));

    return kvTemplate.replace("key", key).replace("value", arr) + newline;
  } else if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return (
      kvTemplate.replace("key", key).replace("value", String(value)) + newline
    );
  } else if (value !== null && typeof value === "object") {
    const sectionName = parentSection ? `${parentSection}.${key}` : key;

    const section = sectionTemplate.replace("section", sectionName) + newline;

    let str = "";

    for (const [childKey, childValue] of Object.entries(value)) {
      str += parseObjectLineToString(
        childKey,
        childValue,
        newline,
        sectionName,
      );
    }

    return newline + section + str;
  }

  return "";
}

function parseIndividualSectionToString(
  section: Section,
  lineFeed: string = "\n",
): string {
  let string = "";
  section.lines.forEach((line) => {
    switch (line.type) {
      case ParsedLineType.KeyValuePair:
        // @ts-ignore womp womp
        let key = line.content.key;
        let value;
        // @ts-ignore womp womp
        if (Array.isArray(line.content.value)) {
          // @ts-ignore womp womp
          value = `{${line.content.value.join(",")}}`;
        } else {
          // @ts-ignore womp womp
          value = line.content.value;
        }
        string = string + key + "=" + value;
        // @ts-ignore womp womp
        if (line.content.inlineComment) {
          // @ts-ignore womp womp
          string =
            string +
            " " +
            // @ts-ignore womp womp
            line.content.inlineComment.leadingCharacter +
            // @ts-ignore womp womp
            line.content.inlineComment.comment +
            lineFeed;
        } else {
          string = string + lineFeed;
        }
        break;
      case ParsedLineType.FullLineComment:
        // @ts-ignore womp womp
        string =
          string +
          // @ts-ignore womp womp
          line.content.leadingCharacter +
          // @ts-ignore womp womp
          line.content.content +
          lineFeed;
        break;
      case ParsedLineType.Empty:
        string = string + "" + lineFeed;
        break;
    }
  });

  if (section.subsections.length >= 1) {
    section.subsections.forEach((childSection) => {
      string = string + `[${childSection.name.replace("section.", "")}]`;
      if (childSection.inlineComment) {
        // @ts-ignore womp womp
        string =
          string +
          " " +
          childSection.inlineComment.leadingCharacter +
          // @ts-ignore womp womp
          childSection.inlineComment.comment;
      }
      string = string + lineFeed + parseIndividualSectionToString(childSection);
    });
  }

  return string;
}

export { parseObjectLineToString, parseIndividualSectionToString };
