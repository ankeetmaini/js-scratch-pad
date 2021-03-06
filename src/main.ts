import { app, BrowserWindow } from "electron";
import * as path from "path";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1";
var mainWindow: Electron.BrowserWindow = null;

app.on("window-all-closed", function() {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });
  mainWindow.webContents.openDevTools({ mode: "right" });
  mainWindow.loadURL("file://" + path.resolve(__dirname, "..", "index.html"));

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
});
