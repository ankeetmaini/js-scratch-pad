/// <reference path="node_modules/monaco-editor/monaco.d.ts" />
import * as puppeteer from "puppeteer";
// import * as electron from "electron";
// import { remote } from "electron";
// const app = remote.app;
// const BrowserWindow = remote.BrowserWindow;
// const dialog = remote.dialog;

declare var amdRequire;
var editor: monaco.editor.IStandaloneCodeEditor;

// loader.jsのrequire関数を使い、monaco-editorのコードを読み込む
amdRequire(["vs/editor/editor.main"], () => {
  onModuleLoaded();
});

// monaco-editorのモジュール読み込み完了時に行う、エディタ初期化処理
function onModuleLoaded() {
  editor = monaco.editor.create(document.getElementById("container"), {
    value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true,
    codeLens: false,
    fontSize: 14,
    scrollBeyondLastLine: false,
    minimap: { enabled: false }
  });

  editor.addCommand(
    monaco.KeyMod.CtrlCmd + monaco.KeyCode.Enter,
    () => {
      const model = editor.getModel();
      const code = model.getValue();
      evaluate(code);
    },
    ""
  );
}

const evaluate = async content => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on("console", message => {
    console.log(message.text());
  });
  page.on("error", err => {
    console.log(err);
  });

  page.on("pageerror", err => {
    console.log(err);
  });

  await page.addScriptTag({ content });
  await browser.close();
};
