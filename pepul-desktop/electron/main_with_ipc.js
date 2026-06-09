const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

if (process.env.ELECTRON_RUN_AS_NODE === '1') {
  try {
    delete process.env.ELECTRON_RUN_AS_NODE;
    const rootDir = path.resolve(__dirname, '..');
    let resolvedBinary;

    try {
      const electronPkg = require(path.join(rootDir, 'node_modules', 'electron', 'package.json'));
      if (electronPkg && fs.existsSync(electronPkg.main)) {
        resolvedBinary = electronPkg.main;
      }
    } catch {}

    if (!resolvedBinary) {
      const candidates = [
        path.join(rootDir, 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron'),
        path.join(rootDir, 'node_modules', 'electron', 'dist', 'electron'),
        path.join(rootDir, 'node_modules', '.bin', 'electron'),
      ];
      resolvedBinary = candidates.find((p) => fs.existsSync(p));
    }

    if (!resolvedBinary) {
      console.error('[main.js] Could not locate Electron binary while ELECTRON_RUN_AS_NODE=1.');
      process.exit(1);
    }

    const child = spawn(resolvedBinary, [process.argv[1], ...process.argv.slice(2)], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    child.on('error', (err) => {
      console.error('[main.js] Failed to launch Electron binary:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('[main.js] Failed to recover from ELECTRON_RUN_AS_NODE=1:', err);
    process.exit(1);
  }
} else {
  main();
}

function main() {
  const { app, BrowserWindow, ipcMain } = require('electron');
  const path = require('path');
  const fs = require('fs');
  const http = require('http');

  function createWindow() {
    const win = new BrowserWindow({ width: 1280, height: 900 });
    win.loadURL('http://localhost:3002/generated-apps/code-project/app');
    win.webContents.openDevTools({ mode: 'detach' });
    return win;
  }

  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  ipcMain.handle('read-file', async (_event, filePath) => {
    return fs.readFileSync(filePath, 'utf-8');
  });
}
