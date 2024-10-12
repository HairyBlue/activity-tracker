const { app, BrowserWindow } = require("electron");
const path = require("node:path");
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// run this as early in the main process as possible
if (require("electron-squirrel-startup")) app.quit();

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    width: 800,
    height: 600,
    icon: path.join(__dirname, "favicon.ico"),
    autoHideMenuBar: true
  });

  win.loadFile(path.join(__dirname, "loading.html"));

  setTimeout(()=>{
    win.loadURL(process.env.ELECTRON_URL)
    .catch(() => {
      win.loadFile(path.join(__dirname, "503.html"));
    });
  }, 2500)

  win.maximize();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
