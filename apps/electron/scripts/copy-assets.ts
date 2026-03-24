/**
 * Cross-platform asset copy script.
 *
 * Copies the resources/ directory to dist/resources/.
 * All bundled assets (docs, themes, permissions, tool-icons) now live in resources/
 * which electron-builder handles natively via directories.buildResources.
 *
 * At Electron startup, setBundledAssetsRoot(__dirname) is called, and then
 * getBundledAssetsDir('docs') resolves to <__dirname>/resources/docs/, etc.
 *
 * Run: bun scripts/copy-assets.ts
 */

import { cpSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Copy all resources (icons, themes, docs, permissions, tool-icons, etc.)
cpSync('resources', 'dist/resources', { recursive: true });

console.log('✓ Copied resources/ → dist/resources/');

// Copy PowerShell parser script (for Windows command validation in Explore mode)
// Source: packages/shared/src/agent/powershell-parser.ps1
// Destination: dist/resources/powershell-parser.ps1
const psParserSrc = join('..', '..', 'packages', 'shared', 'src', 'agent', 'powershell-parser.ps1');
const psParserDest = join('dist', 'resources', 'powershell-parser.ps1');
try {
  copyFileSync(psParserSrc, psParserDest);
  console.log('✓ Copied powershell-parser.ps1 → dist/resources/');
} catch (err) {
  // Only warn - PowerShell validation is optional on non-Windows platforms
  console.log('⚠ powershell-parser.ps1 copy skipped (not critical on non-Windows)');
}

// Copy Pi agent server for packaged Pi-backed sessions/automations.
// The server is built into packages/pi-agent-server/dist/index.js and depends on
// the external koffi native module, so we bundle the JS entrypoint plus the
// platform-specific koffi runtime files into dist/resources/pi-agent-server.
const piServerSrc = join('..', '..', 'packages', 'pi-agent-server', 'dist', 'index.js');
const piServerDestDir = join('dist', 'resources', 'pi-agent-server');
const piServerDest = join(piServerDestDir, 'index.js');

if (existsSync(piServerSrc)) {
  mkdirSync(piServerDestDir, { recursive: true });
  copyFileSync(piServerSrc, piServerDest);

  const koffiSrc = join('..', '..', 'node_modules', 'koffi');
  if (existsSync(koffiSrc)) {
    const koffiDest = join(piServerDestDir, 'node_modules', 'koffi');
    mkdirSync(koffiDest, { recursive: true });

    for (const entry of ['package.json', 'index.js', 'indirect.js', 'index.d.ts', 'lib']) {
      const src = join(koffiSrc, entry);
      if (existsSync(src)) {
        cpSync(src, join(koffiDest, entry), { recursive: true });
      }
    }

    const koffiPlatformDir = process.platform === 'darwin'
      ? `darwin_${process.arch === 'arm64' ? 'arm64' : 'x64'}`
      : process.platform === 'linux'
        ? `linux_${process.arch === 'arm64' ? 'arm64' : 'x64'}`
        : `win32_${process.arch === 'arm64' ? 'arm64' : 'x64'}`;

    const nativeSrc = join(koffiSrc, 'build', 'koffi', koffiPlatformDir);
    const nativeDest = join(koffiDest, 'build', 'koffi', koffiPlatformDir);

    if (existsSync(nativeSrc)) {
      mkdirSync(nativeDest, { recursive: true });
      cpSync(nativeSrc, nativeDest, { recursive: true });
    } else if (existsSync(join(koffiSrc, 'build'))) {
      cpSync(join(koffiSrc, 'build'), join(koffiDest, 'build'), { recursive: true });
    }

    console.log(`✓ Copied pi-agent-server → dist/resources/ (with koffi ${koffiPlatformDir})`);
  } else {
    console.log('⚠ koffi not found; pi-agent-server copied without native runtime');
  }
} else {
  console.log('⚠ pi-agent-server build output not found; Pi-backed sessions will be unavailable in packaged app');
}
