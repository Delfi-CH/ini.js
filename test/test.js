import { readIniSync, readIni } from "../src/index.js";

async function test() {
    let passed = 0;
    let failed = 0;
    console.log("Running synchronus parsing of LF encoded file...");

    try {
        readIniSync("data/example_lf.ini");
        passed++;
    } catch (e) {
        console.error(e);
        failed++;
    }

    console.log("Running synchronus parsing of CRLF encoded file...");

    try {
        readIniSync("data/example_crlf.ini");
        passed++;
    } catch (e) {
        console.error(e);
        failed++;
    }

    console.log("Running synchronus parsing of incorrect LF encoded file...");

    try {
        readIniSync("data/incorrect_lf.ini");
        failed++;
    } catch (e) {
        passed++;
    }

    console.log("Running synchronus parsing of incorrect CRLF encoded file...");

    try {
        readIniSync("data/incorrect_crlf.ini");
        failed++;
    } catch (e) {
        passed++;
    }
    
    console.log("Running asynchronus parsing of LF encoded file...");

    try {
        await readIni("data/example_lf.ini");
        passed++;
    } catch (e) {
        console.error(e);
        failed++;
    }

    console.log("Running asynchronus parsing of CRLF encoded file...");

    try {
        await readIni("data/example_crlf.ini");
        passed++;
    } catch (e) {
        console.error(e);
        failed++;
    }

    console.log("Running asynchronus parsing of incorrect LF encoded file...");

    try {
        await readIni("data/incorrect_lf.ini");
        failed++;
    } catch (e) {
        passed++;
    }

    console.log("Running asynchronus parsing of incorrect CRLF encoded file...");

    try {
        await readIni("data/incorrect_crlf.ini");
        failed++;
    } catch (e) {
        passed++;
    }
    

    console.log("\nTotal: " + (passed + failed));
    console.log("Passed: " + passed);
    console.log("Failed: " + failed);

    if (failed === 0) {
        console.log("\nPassed all tests")
    }
}

test();
//readIni("example_crlf.ini")