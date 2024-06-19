'use strict';


const fs = require('fs');
const path = require('path');

const objectPath = require('object-path');

const ROOT_DIR = path.join(__dirname, '..');
const INPUT_DIR = path.join(ROOT_DIR, 'generated_locales');
const LOCALES = [
  'en',
  'nl',
  'de',
  'fr',
  'it',
  'sv',
  'no',
  'es',
  'da',
  'ru',
  'pl',
];

console.log(
  `Applying locales (${LOCALES.map(x => x.toUpperCase())}) from ${INPUT_DIR}...`,
);

// loop all valid locales
LOCALES.forEach(locale => {
  const localePath = path.join(INPUT_DIR, `${locale}.json`);
  if (fs.existsSync(localePath)) {
    const localeContent = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    delete localeContent.__comment;
    Object.entries(localeContent).forEach(([key, value]) => {
      // Split file path and translation key
      const [sourceFilePath, translationPath] = key.split('@');

      // Read original content of file
      const originalContent = JSON.parse(
        fs.readFileSync(sourceFilePath, 'utf8'),
      );

      // Apply translation to original content
      objectPath.set(originalContent, `${translationPath}.${locale}`, value);

      // Write updated content back to file
      fs.writeFileSync(
        sourceFilePath,
        JSON.stringify(originalContent, null, 2),
      );
    });
  }
});

console.log('Applied locales.');
