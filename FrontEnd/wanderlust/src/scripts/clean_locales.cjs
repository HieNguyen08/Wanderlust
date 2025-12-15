const fs = require('fs');
const path = require('path');

const locales = ['vi', 'en', 'ja', 'ko'];
const baseDir = path.join(__dirname, '../locales');

locales.forEach(locale => {
    const filePath = path.join(baseDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }
    const content = fs.readFileSync(filePath, 'utf8');

    try {
        // Custom parser to detect if we are overwriting different values
        // But for now, standard JSON.parse is sufficient to remove syntax duplicates.
        // The key that appears last wins.
        const json = JSON.parse(content);

        // Write back with consistent indentation
        const cleanedContent = JSON.stringify(json, null, 2);
        fs.writeFileSync(filePath, cleanedContent);
        console.log(`Cleaned ${locale}.json`);
    } catch (e) {
        console.error(`Error parsing ${locale}.json:`, e);
    }
});
