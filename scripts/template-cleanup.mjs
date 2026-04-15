import { promises as fs } from 'fs';
import path from 'path';

const projectRoot = process.cwd();

const TARGET_DIRS = [
    'tests',
    path.join('src', 'fixtures'),
];

const FILE_PATTERNS = [
    /(example|sample|template)\.spec\.(ts|js)$/i,
    /(example|sample|template)\.fixture\.(ts|js)$/i,
    /(example|sample|template)\.(ts|js)$/i,
];

const removedFiles = [];

async function exists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

function shouldRemove(fileName) {
    return FILE_PATTERNS.some((pattern) => pattern.test(fileName));
}

async function walkAndRemove(dirPath) {
    if (!(await exists(dirPath))) {
        return;
    }

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            await walkAndRemove(fullPath);
            continue;
        }

        if (shouldRemove(entry.name)) {
            await fs.unlink(fullPath);
            removedFiles.push(path.relative(projectRoot, fullPath));
        }
    }
}

async function cleanupFixtureIndex() {
    const fixtureIndexPath = path.join(projectRoot, 'src', 'fixtures', 'index.ts');
    if (!(await exists(fixtureIndexPath))) {
        return;
    }

    const content = await fs.readFile(fixtureIndexPath, 'utf8');
    const cleaned = content
        .split('\n')
        .filter((line) => !/(example|sample|template)\.fixture/i.test(line))
        .join('\n');

    if (cleaned !== content) {
        await fs.writeFile(fixtureIndexPath, cleaned, 'utf8');
    }
}

async function main() {
    for (const relativeDir of TARGET_DIRS) {
        const dirPath = path.join(projectRoot, relativeDir);
        await walkAndRemove(dirPath);
    }

    await cleanupFixtureIndex();

    if (removedFiles.length === 0) {
        console.log('Template cleanup completed. No sample/example/template files found.');
        return;
    }

    console.log('Template cleanup completed. Removed files:');
    for (const file of removedFiles) {
        console.log(`- ${file}`);
    }
}

main().catch((error) => {
    console.error('Template cleanup failed:', error);
    process.exit(1);
});
