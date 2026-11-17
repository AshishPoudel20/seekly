/**
 * Reliable Expo starter:
 * - Frees common Metro ports so QR always maps to this session
 * - Always uses tunnel so phones can connect even when LAN/firewall blocks
 */
const { spawn, execSync } = require('child_process');
const path = require('path');

const PORTS = [8081, 8082, 8095, 19000, 19001, 19002];
const root = path.resolve(__dirname, '..');

function killPort(port) {
  try {
    const out = execSync(`netstat -ano | findstr ":${port}" | findstr LISTENING`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        console.log(`Freed port ${port} (killed PID ${pid})`);
      } catch {
        // already gone
      }
    }
  } catch {
    // nothing listening
  }
}

console.log('Preparing Expo (tunnel mode for reliable QR)...');
for (const port of PORTS) killPort(port);

const args = ['expo', 'start', '--tunnel', '--port', '8081', ...process.argv.slice(2)];
console.log(`> npx ${args.join(' ')}\n`);

const child = spawn('npx', args, {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    EXPO_NO_TELEMETRY: '1',
  },
});

child.on('exit', (code) => process.exit(code ?? 0));
