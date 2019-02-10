/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />
import * as puppeteer from "puppeteer";

declare var amdRequire;
var editor: monaco.editor.IStandaloneCodeEditor;

amdRequire(["vs/editor/editor.main"], () => {
  onModuleLoaded();
});

function onModuleLoaded() {
  editor = monaco.editor.create(document.getElementById("container"), {
    value: ["const cool = () => {", '\tconsole.log("I am cool.");', "}"].join(
      "\n"
    ),
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
