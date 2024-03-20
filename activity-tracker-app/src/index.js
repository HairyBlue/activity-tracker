const { app, BrowserWindow } = require("electron");
const path = require("node:path");

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
  });

  win.loadURL("http://localhost:3500/").catch(() => {
    win.loadFile(path.join(__dirname, "sitedown.html"));
  });
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
