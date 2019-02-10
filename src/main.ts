import { app, BrowserWindow } from "electron";
import * as path from "path";

// メインウィンドウの参照をグローバルに持っておく。
var mainWindow: Electron.BrowserWindow = null;

// すべてのウィンドウが閉じられた際の動作
app.on("window-all-closed", function() {
  // OS X では、ウィンドウを閉じても一般的にアプリ終了はしないので除外。
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", function() {
  // 新規ウィンドウ作成
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.webContents.openDevTools({ mode: "right" });
  // index.htmlを開く
  mainWindow.loadURL("file://" + path.resolve(__dirname, "..", "index.html"));

  // ウィンドウが閉じられたら、ウィンドウへの参照を破棄する。
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
});