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
    - [Comments which include comments](#comments-which-include-comments)
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

#### Comments which include comments

*Note: This won't throw a parsing error, but this will remove the contents of the comment* 

```ini
key12=value12 ; This will be removed ; Same for this # and this
```

## Documentation

### Core

This is the core part of the library, which parses strings to Objects and back.
It only uses plain JavaScript, which means it can be used anywhere.

Import:

```js
// ES-Modules
import {iniStringToObject, objectToIniString} from "@delfi-ch/ini.js";
// CommonJS
const {iniStringToObject, objectToIniString} = require("@delfi-ch/ini.js");
```

todo

### FS

The fs module handles reading and writing directly from disk via the nodeJS "fs" API.
It can only be used inside of NodeJS.

Import:

```js
// ES-Modules
import { readIni, writeIni, readIniSync, writeIniSync } from "@delfi-ch/ini.js/fs";
// CommonJS
const { readIni, writeIni, readIniSync, writeIniSync } = require("@delfi-ch/ini.js/fs");
```

todo

## Example

todo