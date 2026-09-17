import { ParsedLineType, type Section } from "./stringparse.js";

const kvTemplate = "key=value";
const arrayTemplate = "{values}";
const sectionTemplate = "[section]";

function parseObjectLineToString(
  key: string,
  value: any,
  newline: string = "\n",
  parentSection?: string
): string {
  if (Array.isArray(value)) {
    const arr = arrayTemplate.replace("values", value.join(","));

    return (
      kvTemplate
        .replace("key", key)
        .replace("value", arr) +
      newline
    );

  } else if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return (
      kvTemplate
        .replace("key", key)
        .replace("value", String(value)) +
      newline
    );

  } else if (value !== null && typeof value === "object") {
    const sectionName = parentSection
      ? `${parentSection}.${key}`
      : key;

    const section =
      sectionTemplate.replace("section", sectionName) +
      newline;

    let str = "";

    for (const [childKey, childValue] of Object.entries(value)) {
      str += parseObjectLineToString(
        childKey,
        childValue,
        newline,
        sectionName
      );
    }

    return newline + section + str;
  }

  return "";
}

function parseIndividualSectionToString(section: Section, lineFeed: string = "\n"): string {
  let string = ""
  section.lines.forEach(line => {
    switch (line.type) {
      case ParsedLineType.KeyValuePair:
        let key = line.content.key
        let value;
        if (Array.isArray(line.content.value)) {
          value = `{${line.content.value.join(",")}}`
        } else {
          value = line.content.value
        }
        string = string + key + "=" + value
        if (line.content.inlineComment) {
          string = string + " " + line.content.inlineComment.leadingCharacter + line.content.inlineComment.comment + lineFeed
        } else {
          string = string + lineFeed
        }
        break;
      case ParsedLineType.FullLineComment:
        string = string + line.content.leadingCharacter + line.content.content + lineFeed
        break;
      case ParsedLineType.Empty:
        string = string + "" + lineFeed
        break;
    }
  });
  
  if (section.subsections.length >= 1) {
    section.subsections.forEach((childSection)=>{
      string = string + `[${childSection.name.replace("section.", "")}]`
      if (childSection.inlineComment) {
        string = string + " " + childSection.inlineComment.leadingCharacter + childSection.inlineComment.comment
      }
      string = string + lineFeed +parseIndividualSectionToString(childSection)
    })
  }

  return string
}

export { parseObjectLineToString, parseIndividualSectionToString };
