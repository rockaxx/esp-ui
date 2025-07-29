const { ipcRenderer } = require('electron');

async function refreshPorts() {
  const select = document.getElementById('comSelect');
  select.innerHTML = '';
  // Dummy port vždy prvý
  const dummyOpt = document.createElement('option');
  dummyOpt.value = 'COM_HORSE';
  dummyOpt.textContent = 'COM_HORSE (dummy)';
  select.appendChild(dummyOpt);

  // Skutočné porty
  const ports = await ipcRenderer.invoke('list-serial-ports');
  ports.forEach(port => {
    const opt = document.createElement('option');
    opt.value = port;
    opt.textContent = port;
    select.appendChild(opt);
  });
}

window.onload = refreshPorts;

async function connectPort() {
  const portName = document.getElementById('comSelect').value;
  if (!portName) return alert('Vyber COM port!');
  if (portName === 'COM_HORSE') {
    window.location.href = "app.html"; // prepne na nový html súbor
    return;
  }
  await ipcRenderer.invoke('connect-serial-port', portName);
  window.location.href = "app.html";
}



function sendCommand(cmd) {
  ipcRenderer.send('send-command', cmd);
}

window.sendCommand = sendCommand;
window.connectPort = connectPort;
window.refreshPorts = refreshPorts;
