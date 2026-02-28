const fs = require('fs');
const path = require('path');

const targetWord = 'marostore';
const directoryToScan = './src'; // Only scan your source code

function scanDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(targetWord)) {
                console.log(`🔍 Found in: ${fullPath}`);
            }
        }
    });
}

console.log(`Scanning for "${targetWord}"...`);
scanDirectory(directoryToScan);
console.log('Scan complete.');