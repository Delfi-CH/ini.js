# ini.js

Key-Value Parser for JavaScript

## Table of Contents

- [Overview](#overview)
- [Syntax](#syntax)
  - [Allowed Syntax](#allowed-syntax)
    - [Key-Value Allocation](#key-value-allocation)
    - [Sections](#sections)
    - [Full line comments](#full-line-comments)
    - [Quoted Values && Escape Codes](#quoted-values--escape-codes)
  - [Disallowed Syntax](#disallowed-syntax)
    - [Nested Sections](#nested-sections)
    - [Inline comments](#inline-comments)
    - [Duplicate Values](#duplicate-values)
- [Documentation](#documentation)
  - [Core](#core)
    - [`iniStringToObject(string): Object`](#inistringtoobjectstring-object)
    - [`objectToIniString(object): String`](#objecttoinistringobject-string)
  - [FS](#fs)
    - [`readIni(filepath): Object`](#readinifilepath-object)
    - [`readIniSync(filepath): Object`](#readinisyncfilepath-object)
    - [`writeIni(filepath, object)`](#writeinifilepath-object)
    - [`writeIniSync(filepath)`](#writeinisyncfilepath)
- [Example](#example)
  - [examples/config.ini](#examplesconfigini)
  - [examples/examples.js](#examplesexamplesjs)

## Overview

A minimal JavaScript parser for .ini-style Key=Value files/strings.

This does not implement every feature of .ini-style files (see [https://en.wikipedia.org/wiki/INI_file#Format](https://en.wikipedia.org/wiki/INI_file#Format) for more Information). What is allowed/disallowed can be seen below.

## Syntax

### Allowed Syntax

#### Key-Value Allocation

```ini
key=value
```

#### Sections

```ini
[Section]
key2=value2

;This is not part of the Section
key3=value3
```

#### Full line comments

```ini
; This works!
key4=value4
```

#### Quoted Values && Escape Codes

```ini
key5="Value\n5"
```

### Disallowed Syntax

#### Nested Sections

```ini
[Section]
key6=value6

[Section.subsection]
key7=value7
```

#### Inline comments

```ini
key8=value8 ; This doesnt work.
```

#### Duplicate Values

```ini
key9=value9
key9=value90
```

## Documentation

### Core

This is the core part of the library, which parses strings to Objects and back.
It only uses plain JavaScript, which means it can be used anywhere.

Import:

```js
// ES-Modules
import {iniStringToObject, objectToIniString} from "ini.js";
// CommonJS
const {iniStringToObject, objectToIniString} = require("ini.js");
```

#### `iniStringToObject(string): Object`

Convert a string, which is formatted like a .ini file to a JavaScript object.

```js
const myString = "key=value\nnumber=42\n"
const myObject = iniStringToObject(myString)
```

Output

```json
{ key: 'value', number: 42 }
```

#### `objectToIniString(object): String`

Convert a JavaScript object to a string, which is formatted like a .ini file.

```js
const myObject = {key: "value", number: 42}
const myString = objectToIniString(myObject)
```

Output

```ini
key=value
number=42
```

### FS

The fs module handles reading and writing directly from disk via the nodeJS "fs" API.
It can only be used inside of NodeJS.

Import:

```js
// ES-Modules
import { readIni, writeIni, readIniSync, writeIniSync } from "ini.js/fs";
// CommonJS
const { readIni, writeIni, readIniSync, writeIniSync } = require("ini.js/fs");
```

#### `readIni(filepath): Object`

Asynchronous reading of a .ini file to a JavaScript object.

```js
const config = await readIni("config.ini")
```

#### `readIniSync(filepath): Object`

Synchronous reading of a .ini file to a JavaScript object.

```js
const config = readIniSync("config.ini")
```

#### `writeIni(filepath, object)`

Asynchronous writing of a JavaScript object to a .ini file.

```js
const myObject = {key: "value", number: 42}
await writeIni("example.ini", myObject)
```

#### `writeIniSync(filepath)`

Synchronous writing of a JavaScript object to a .ini file.

```js
const myObject = {key: "value", number: 42}
writeIniSync("example.ini", myObject)
```

## Example

### examples/config.ini

```ini
[database]
address=localhost:3306
user=root
; TODO: change this
password=supersecredpassword

port=3000
auth=true
laststarted=2026-03-16T20:31:48.299Z
```

### examples/examples.js

```js
import { readIni, writeIni, readIniSync, writeIniSync } from "ini.js/fs";
import { iniStringToObject } from "ini.js"

/* CommonJS Imports
const { readIni, writeIni, readIniSync, writeIniSync } = require("ini.js/fs") 
const { iniStringToObject } = require("ini.js")
*/

// synchronous examples

function start() {
    let config = readIniSync("examples/config.ini")

    console.log(`Database connection: ${config.database.address}`)
    console.log(`Starting App at Port ${config.port} with auth=${config.auth}`)

    config.laststarted = new Date().toISOString()

    writeIniSync("examples/config_new.ini", config)

    console.log(`Started at: ${readIniSync("examples/config.ini").laststarted}`)
}

start()

// asynchronous examples

async function asyncStart(params) {
    let config = await readIni("examples/config.ini")

    console.log(`Database connection: ${config.database.address}`)
    console.log(`Starting App at Port ${config.port} with auth=${config.auth}`)

    config.laststarted = new Date().toISOString()

    await writeIni("examples/config_new.ini", config)

    const startedAt = await readIni("examples/config.ini")

    console.log(`Started at: ${startedAt.laststarted}`)
}

asyncStart()

// no fs example

function stringToObject() {
    const string = "key=value\ncool=yes"
    const object = iniStringToObject(string)
    console.log("cool: " + object.cool)
}

stringToObject()
```
