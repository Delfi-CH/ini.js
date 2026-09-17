# ini.js

Key-Value Parser for JavaScript

View on npm: [https://www.npmjs.com/package/@delfi-ch/ini.js?activeTab=readme](https://www.npmjs.com/package/@delfi-ch/ini.js?activeTab=readme)

## Table of Contents

- [Overview](#overview)
- [Syntax](#syntax)
  - [Allowed Syntax](#allowed-syntax)
    - [Key-Value Allocation](#key-value-allocation)
    - [Sections](#sections)
    - [Full line comments](#full-line-comments)
    - [Inline comments](#inline-comments)
    - [Arrays](#arrays)
    - [Quoted Values && Escape Codes](#quoted-values--escape-codes)
  - [Disallowed Syntax](#disallowed-syntax)
    - [Duplicate Values](#duplicate-values)
    - [= character inside values](#-character-inside-values)
    - [Comments which include comments](#comments-which-include-comments)
    - [Multi-line values](#multi-line-values)
- [Documentation](#documentation)
  - [Core](#core)
  - [FS](#fs)
- [Example](#example)

## Overview

Installation:

`npm i @delfi-ch/ini.js`

or

`pnpm i @delfi-ch/ini.js`

A JavaScript/TypeScript library for parsing .ini-style Key=Value files/strings.

## Syntax

### Key-Value Allocation

```ini
key=value
```

### Sections

```ini
[Section]
key2=value2

;This is not part of the Section
key3=value3
```

### Full line comments

```ini
; This works!
key4=value4
```

```ini
# This also works!
key5=value5
```

### Inline comments

```ini
key6=value6 ; This doesnt work.

key7=value7 # Same for this.
```

### Arrays

```ini
key8={1,2,3,4,5}

key9={true,42,"this is a string"}
```

### Quoted Values && Escape Codes

```ini
key10="Value\n6"
```

### Disallowed Syntax

#### Duplicate Values

```ini
key11=value11
key11=value110
```

#### = character inside values

```ini
key12=value12=value13
```

#### Comments which include comments

_Note: This won't throw a parsing error, but this will remove the contents of the comment_

```ini
key13=value13 ; This will be removed ; Same for this # and this
```

#### Multi-line values

```ini
key14=value \
14
```

## Documentation

### Core

The core part of the library, which parses strings to Objects and back.
It can be used anywhere where JavaScript runs.

Import:

```js
// ES-Modules
import {
  iniToObject,
  objectToIni,
  iniToSyntaxTree,
  syntaxTreeToIni,
} from "@delfi-ch/ini.js";
// CommonJS
const {
  iniToObject,
  objectToIni,
  iniToSyntaxTree,
  syntaxTreeToIni,
} = require("@delfi-ch/ini.js");
```

todo

### FS

This is a wrapper around the nodeJS fs api, to simplify certain operations.
It can only be used inside nodeJS, deno, bun or similar enviroments.

Import:

```js
// ES-Modules
import {
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
} from "@delfi-ch/ini.js/fs";

// CommonJS
const {
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
} = require("@delfi-ch/ini.js/fs");
```

todo

## Example

todo
