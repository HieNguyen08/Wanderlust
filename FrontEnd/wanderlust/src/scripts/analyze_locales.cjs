
const fs = require('fs');
const path = require('path');

const locales = ['vi', 'en', 'ja', 'ko'];
const baseDir = 'd:/CODE/Graduation_thesis/Wanderlust/FrontEnd/wanderlust/src/locales';

function flattenKeys(obj, prefix = '') {
    let keys = {};
    for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(keys, flattenKeys(value, newKey));
        } else {
            keys[newKey] = value;
        }
    }
    return keys;
}

const data = {};
let allKeys = new Set();

locales.forEach(lang => {
    const content = fs.readFileSync(path.join(baseDir, `${lang}.json`), 'utf8');
    const json = JSON.parse(content);
    data[lang] = flattenKeys(json);
    Object.keys(data[lang]).forEach(k => allKeys.add(k));
});

console.log(`Total unique keys: ${allKeys.size}`);

const missing = {};

locales.forEach(lang => {
    missing[lang] = [];
    allKeys.forEach(key => {
        if (!data[lang].hasOwnProperty(key)) {
            const sourceLang = locales.find(l => data[l].hasOwnProperty(key));
            missing[lang].push({ key, sourceValue: data[sourceLang][key], sourceLang });
        }
    });
});

fs.writeFileSync(path.join(baseDir, '../scripts/missing_keys_fixed.json'), JSON.stringify(missing, null, 2), 'utf8');
console.log('Done writing to missing_keys_fixed.json');
