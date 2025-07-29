require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

const { app, BrowserWindow, ipcMain } = require('electron');
const SerialPort = require('serialport');
const path = require('path');

let port = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // pre jednoduchosť
    }
  });
  win.loadFile('public/index.html');
}

// Posielaj zoznam portov do renderer procesu
ipcMain.handle('list-serial-ports', async () => {
  const ports = await SerialPort.list();
  return ports.map(p => p.path);
});

// Pripoj na zvolený port
ipcMain.handle('connect-serial-port', async (event, portName) => {
  if (port && port.isOpen) port.close();
  port = new SerialPort({ path: portName, baudRate: 115200 });
  return true;
});

// Odosielaj príkazy na ESP
ipcMain.on('send-command', (event, cmd) => {
  if (port && port.isOpen) {
    port.write(cmd + '\n');
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (port && port.isOpen) port.close();
  if (process.platform !== 'darwin') app.quit();
});
