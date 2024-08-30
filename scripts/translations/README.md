# Translations scripts

> These scripts were generated using Claude 3.5 Sonnet

This folder contains:

- an export script that generates a CSV file from the translations in the locales directory
- an import script that generates translation files from a CSV file

## Export.js

Run using `node scripts/translations/export.js [translations dir] [output CSV]`.
Based on the translations in the directory, a CSV file will be created in the output directory.

### Example

Given the following file: `/locales/de/common.json` with the contents:

```json
{
  "hello": "Hallo",
  "nested": {
    "world": "Welt"
  }
}
```

When running the export script, the above JSON translations file would generate two entries in the CSV file:

```csv
key,value
de/common.json/hello,Hallo
de/common.json/nested/world,Welt
```

The key of the translation has the shape `[file path]/[translation-file (might be a nested file)]/[translation key]`.

## Import.js

Run using `node scripts/translations/import.js [translations CSV] [output dir]`.
Based on the output in the csv, the corresponding translation files will be created in the output directory.