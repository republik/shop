const fs = require("fs").promises;
const path = require("path");
const csv = require("csv-stringify/sync");

async function processLocales(localesPath, outputPath) {
  try {
    const locales = await fs.readdir(localesPath);
    let allTranslations = [];

    for (const locale of locales) {
      const localePath = path.join(localesPath, locale);
      const stats = await fs.stat(localePath);

      if (stats.isDirectory()) {
        const translations = await processDirectory(localePath, locale);
        allTranslations = allTranslations.concat(translations);
      }
    }

    await writeCSV(outputPath, allTranslations);
    console.log("CSV file generated successfully.");
  } catch (error) {
    console.error("Error processing locales:", error);
  }
}

async function processDirectory(dirPath, locale, prefix = "") {
  let translations = [];

  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      const subTranslations = await processDirectory(
        filePath,
        locale,
        `${prefix}${file}/`
      );
      translations = translations.concat(subTranslations);
    } else if (path.extname(file) === ".json") {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const json = JSON.parse(fileContent);
      const fileTranslations = flattenObject(
        json,
        locale,
        `${prefix}${path.basename(file, ".json")}.json`
      );
      translations = translations.concat(fileTranslations);
    }
  }

  return translations;
}

function flattenObject(obj, locale, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      return acc.concat(flattenObject(obj[key], locale, `${prefix}/${key}`));
    } else {
      return acc.concat([[`${locale}/${prefix}/${key}`, obj[key]]]);
    }
  }, []);
}

async function writeCSV(outputPath, translations) {
  const csvContent = csv.stringify(translations, {
    header: true,
    columns: [
      { key: "0", header: "key" },
      { key: "1", header: "value" },
    ],
    encoding: "utf8",
  });

  await fs.writeFile(outputPath, csvContent);
  console.log("CSV file for all translations created.");
}

// Check if a folder path is provided as an argument
const localesPath = process.argv[2];
const outputPath = process.argv[3];

if (!localesPath) {
  console.error(
    "Please provide the path to the locales folder as an argument."
  );
  process.exit(1);
}

if (!outputPath) {
  console.error(
    "Please provide the path for the output CSV file as an argument."
  );
  process.exit(1);
}

processLocales(localesPath, outputPath);
