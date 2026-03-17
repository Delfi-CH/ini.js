# ini.js

Key-Value Parser for JavaScript

## Syntax

### Allowed Syntax

Key-Value Allocation

```ini
key=value
```

Sections

```ini
[Section]
key2=value2
```

Full line comments

```ini
; This works!
key3=value3
``` 

Quoted Values && Escape Codes

```ini
key4="Value\n4"
```

### Disallowed Syntax

Nested Sections

```ini
[Section]
key5=value5

[Section.subsection]
key6=value6
```

Inline comments

```ini 
key7=value7 ; This doesnt work.
```

## Documentation

### `readIni(filepath): Object`

Asynchronous reading of a .ini file to a JavaScript object.

```js
const config = await readIni("config.ini")
```

### `readIniSync(filepath): Object`

Synchronous reading of a .ini file to a JavaScript object.

```js
const config = readIniSync("config.ini")
```

### `writeIni(filepath, object)`

Asynchronous writing of a JavaScript object to a .ini file.

```js 
const myObject = {key: "value", number: 42}
await writeIni("example.ini", myObject)
```

### `writeIniSync(filepath)`

Synchronous writing of a JavaScript object to a .ini file.

```js 
const myObject = {key: "value", number: 42}
writeIniSync("example.ini", myObject)
```

### `iniStringToObject(string): Object`

Convert a string, which is formatted like a .ini file to a JavaScript object.

```js 
const myString = "key=value\nnumber=42\n"
const myObject = iniStringToObject(myString)
```
**Output**
```json 
{ key: 'value', number: 42 }
```

### `objectToIniString(object): String`

Convert a JavaScript object to a string, which is formatted like a .ini file.

```js 
const myObject = {key: "value", number: 42}
const myString = objectToIniString(myObject)
```
**Output**
```ini 
key=value
number=42
```

## Example

**examples/config.ini**
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

**examples/examples.js**
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
