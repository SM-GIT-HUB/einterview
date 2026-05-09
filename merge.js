import fs from "fs"
import path from "path"

const ROOT_DIR = "./src";
const OUTPUT_FILE = "./all_code.txt";

const IGNORE_FOLDERS = ["node_modules", ".git"];
const IGNORE_FILES = [".env"];

function shouldIgnore(filePath) {
    const base = path.basename(filePath);

    if (IGNORE_FILES.includes(base)) return true;

    for (const folder of IGNORE_FOLDERS) {
        if (filePath.includes(folder)) return true;
    }

    return false;
}

function readFilesRecursively(dir, outputStream) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);

        if (shouldIgnore(fullPath)) continue;

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            readFilesRecursively(fullPath, outputStream);
        } else {
            const content = fs.readFileSync(fullPath, "utf-8");

            outputStream.write(`\n\n===== FILE: ${fullPath} =====\n\n`);
            outputStream.write(content);
        }
    }
}

function main() {
    const outputStream = fs.createWriteStream(OUTPUT_FILE);

    readFilesRecursively(ROOT_DIR, outputStream);

    outputStream.end();
    console.log("Done. Output saved to", OUTPUT_FILE);
}

main();