const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

let input;
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch (error) {
  console.error(`Failed to read PostToolUse input: ${error.message}`);
  process.exit(1);
}

const command = input.tool_input?.command;
if (!['Bash', 'PowerShell'].includes(input.tool_name) || typeof command !== 'string') {
  console.error('PostToolUse hook expected a Bash or PowerShell command.');
  process.exit(1);
}

if (!/(?:^|[;&|]\s*)npm(?:\.cmd)?\s+test(?=$|[\s;&|])/i.test(command)) {
  process.exit(0);
}

console.log('npm test completed. Running npm run lint.');
const result = spawnSync(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'lint'],
  {
    cwd: process.cwd(),
    shell: process.platform === 'win32',
    stdio: 'inherit',
  },
);

if (result.error) {
  console.error(`Failed to run npm run lint: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
