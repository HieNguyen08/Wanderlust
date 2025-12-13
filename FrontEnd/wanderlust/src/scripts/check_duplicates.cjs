const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../locales');
const files = ['vi.json', 'en.json', 'ja.json', 'ko.json'];

function checkDuplicates(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const stack = [new Set()];
    const pathStack = [];

    console.log(`Checking ${path.basename(filePath)}...`);

    let errors = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        const keyMatch = line.match(/^\s*"([^"]+)":/);

        if (keyMatch) {
            const key = keyMatch[1];
            const currentScope = stack[stack.length - 1];

            if (currentScope.has(key)) {
                console.log(`  Duplicate key "${key}" found at line ${i + 1}`);
                errors++;
            } else {
                currentScope.add(key);
            }

            if (trimmed.endsWith('{')) {
                stack.push(new Set());
                pathStack.push(key);
            }
        } else if (trimmed === '{') {
            stack.push(new Set());
        }

        if (trimmed === '}' || trimmed === '},') {
            if (stack.length > 1) {
                stack.pop();
                pathStack.pop();
            }
        }
    }

    if (errors === 0) {
        console.log(`  No duplicates found.`);
    }
}

files.forEach(file => {
    const p = path.join(localesDir, file);
    if (fs.existsSync(p)) {
        checkDuplicates(p);
    } else {
        console.log(`File not found: ${p}`);
    }
});
