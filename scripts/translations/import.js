const fs = require("fs").promises;
const path = require("path");
const csv = require("csv-parse/sync");

async function revertLocales(inputFile, outputFolder) {
  try {
    const fileContent = await fs.readFile(inputFile, "utf-8");
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      encoding: "utf8",
    });

    const locales = {};

    for (const record of records) {
      const { key, value } = record;
      const [locale, ...pathParts] = key.split("/");
      const jsonFileName = pathParts.find((part) => part.endsWith(".json"));
      const jsonPath = pathParts
        .slice(0, pathParts.indexOf(jsonFileName) + 1)
        .join("/");
      const remainingPath = pathParts.slice(
        pathParts.indexOf(jsonFileName) + 1,
      );

      if (!locales[locale]) {
        locales[locale] = {};
      }

      if (!locales[locale][jsonPath]) {
        locales[locale][jsonPath] = {};
      }

      setNestedValue(locales[locale][jsonPath], remainingPath, value);
    }

    for (const [locale, files] of Object.entries(locales)) {
      for (const [filePath, content] of Object.entries(files)) {
        const fullPath = path.join(
          outputFolder,
          locale,
          path.dirname(filePath),
        );
        await fs.mkdir(fullPath, { recursive: true });

        const jsonContent = JSON.stringify(content, null, 2);
        await fs.writeFile(
          path.join(outputFolder, locale, filePath),
          jsonContent,
        );
      }
    }

    console.log("Locales recreated successfully.");
  } catch (error) {
    console.error("Error reverting locales:", error);
  }
}

function setNestedValue(obj, keys, value) {
  const lastKey = keys.pop();
  const lastObj = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  lastObj[lastKey] = value;
}

// Check if input file and output folder are provided as arguments
const inputFile = process.argv[2];
const outputFolder = process.argv[3];

if (!inputFile || !outputFolder) {
  console.error(
    "Please provide both the input CSV file and the output folder as arguments.",
  );
  process.exit(1);
}

revertLocales(inputFile, outputFolder);
