import { readIniSync, readIni, writeIniSync, writeIni } from "../src/modules/fs.js"
import { isDeepStrictEqual } from "node:util";

async function test() {
    let passed = 0
    let failed = 0
    console.log("Running synchronus parsing of LF encoded file...")

    const exampleLf = {
        key: 'value',
        string: 'String\\r\\n',
        number: 123,
        float: 123.456,
        system: { '69': 69, win: false, bad: 'maybe', compiler: 'gcc' }
    }

    const exampleCrlf = {
        key: 'value',
        string: 'String\\r\\n',
        number: 123,
        float: 123.456,
        system: { '69': 420, win: true, bad: 'forsure', compiler: 'msvc' }
    }

    try {
        let iniLF = readIniSync("data/example_lf.ini")
        isDeepStrictEqual(iniLF, exampleLf) ? passed++ : failed++
    } catch (e) {
        console.error(e)
        failed++
    }

    console.log("Running synchronus parsing of CRLF encoded file...")

    try {
        let iniCRLF = readIniSync("data/example_crlf.ini")
        isDeepStrictEqual(iniCRLF, exampleCrlf) ? passed++ : failed++
    } catch (e) {
        console.error(e)
        failed++
    }

    console.log("Running synchronus parsing of incorrect LF encoded file...")

    try {
        readIniSync("data/incorrect_lf.ini")
        failed++
    } catch (e) {
        passed++
    }

    console.log("Running synchronus parsing of incorrect CRLF encoded file...")

    try {
        readIniSync("data/incorrect_crlf.ini")
        failed++
    } catch (e) {
        passed++
    }
    
    console.log("Running asynchronus parsing of LF encoded file...")

    try {
        let iniLF = await readIni("data/example_lf.ini")
        isDeepStrictEqual(iniLF, exampleLf) ? passed++ : failed++
    } catch (e) {
        console.error(e)
        failed++
    }

    console.log("Running asynchronus parsing of CRLF encoded file...")

    try {
        let iniCRLF = await readIni("data/example_crlf.ini")
        isDeepStrictEqual(iniCRLF, exampleCrlf) ? passed++ : failed++
    } catch (e) {
        console.error(e)
        failed++
    }

    console.log("Running asynchronus parsing of incorrect LF encoded file...")

    try {
        await readIni("data/incorrect_lf.ini")
        failed++
    } catch (e) {
        passed++
    }

    console.log("Running asynchronus parsing of incorrect CRLF encoded file...")

    try {
        await readIni("data/incorrect_crlf.ini")
        failed++
    } catch (e) {
        passed++
    }

    const someObject = {key: "value", num: 69, bool: true, array: "illegal", section: {a: "b", c: "d"}, last: "last" }

    console.log("Attemting synchronus parsing of a object...")
    try {
        writeIniSync("data/output_sync.ini", someObject)
        let iniSync = readIniSync("data/output_sync.ini")
        isDeepStrictEqual(iniSync, someObject) ? passed++ : failed++
    } catch (e) {
        console.error(e)
        failed++
    }
    
    console.log("Attemting asynchronus parsing of a object...")
    try {
        await writeIni("data/output_async.ini", someObject)
        let iniAsync = await readIni("data/output_sync.ini")
        isDeepStrictEqual(iniAsync, someObject) ? passed++ : failed++
    } catch (e) {
        console.error(e)
        failed++
    }

    console.log("\nTotal: " + (passed + failed))
    console.log("Passed: " + passed)
    console.log("Failed: " + failed)

    if (failed === 0) {
        console.log("\nPassed all tests")
    }
}

test()
