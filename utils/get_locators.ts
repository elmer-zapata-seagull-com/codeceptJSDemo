import * as fs from 'fs';
import * as path from 'path';

interface UIAElement {
    Name?: string;
    AutomationId?: string;
    ControlType?: string;
    ClassName?: string;
    FrameworkId?: string;
}

function escapeQuotes(text: string): string {
    return text.replace(/"/g, '\\"').replace(/'/g, "\\'");
}

function parseElementFromText(text: string): UIAElement {
    const element: UIAElement = {};
    const lines = text.split(/\r?\n/);

    for (const line of lines) {
        const [keyRaw, ...valueParts] = line.split(':');
        const key = keyRaw.trim();
        const value = valueParts.join(':').trim();

        if (key === 'Name') element.Name = value;
        if (key === 'AutomationId') element.AutomationId = value;
        if (key === 'ClassName') element.ClassName = value;
        if (key === 'FrameworkId') element.FrameworkId = value;

        if (key === 'ControlType') {
            const match = value.match(/UIA_(\w+)ControlTypeId/);
            element.ControlType = match ? match[1] : value;
        }
    }

    return element;
}

function generateLocators(el: UIAElement): string {
    const lines: string[] = [];

    // XPath
    const xpathParts: string[] = [];
    if (el.Name) xpathParts.push(`@Name='${escapeQuotes(el.Name)}'`);
    if (el.AutomationId) xpathParts.push(`@AutomationId='${el.AutomationId}'`);
    if (el.ControlType) xpathParts.push(`@ControlType='${el.ControlType}'`);
    const xpath = xpathParts.length
        ? `//${el.ControlType || '*'}[${xpathParts.join(' and ')}]`
        : '//Unknown';

    lines.push('🔎 XPath:');
    lines.push(`  ${xpath}\n`);

    // Appium / WinAppDriver
    lines.push('📱 Appium / WinAppDriver:');
    if (el.AutomationId) lines.push(`  driver.findElementByAccessibilityId("${el.AutomationId}")`);
    if (el.Name) lines.push(`  driver.findElementByName("${el.Name}")`);

    // pywinauto
    lines.push('\n🐍 pywinauto:');
    const pyParts: string[] = [];
    if (el.Name) pyParts.push(`title="${el.Name}"`);
    if (el.AutomationId) pyParts.push(`auto_id="${el.AutomationId}"`);
    if (el.ControlType) pyParts.push(`control_type="${el.ControlType}"`);
    lines.push(`  child_window(${pyParts.join(', ')})`);

    return lines.join('\n');
}

// Main
const inputFilePath = process.argv[2];
if (!inputFilePath) {
    console.error('❌ Please add the path. Example:');
    console.error('   ts-node generate-locators-from-file.ts path/to/file.txt');
    process.exit(1);
}

const fileContent = fs.readFileSync(path.resolve(inputFilePath), 'utf-8');
const element = parseElementFromText(fileContent);
const output = generateLocators(element);

console.log(output);
