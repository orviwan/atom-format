import {execSync} from 'child_process';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import {CompositeDisposable} from 'atom';

export class ClangFormat {
  private subscriptions = new CompositeDisposable();

  constructor() {
    this.subscriptions.add(atom.commands.add('atom-workspace', 'atom-format:format', () => {
      var editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        this._format(editor);
      }
    }));
    this.subscriptions.add(atom.workspace.observeTextEditors((editor) => {
      this.subscriptions.add(editor.getBuffer().onWillSave(() => {
        var autoSave = atom.config.get('atom-format.autoSave');
        var extension = (editor.getPath().match(/\..+?$/) || [])[0];
        if (autoSave.indexOf(extension) >= 0)
          this._format(editor);
      }));
    }));
  }
  public destroy() {
    this.subscriptions.dispose();
  }

  private _format(editor) {
    var binary = atom.config.get('atom-format.executable');
    if (!binary) {
      binary = './bin/' + os.platform() + "_" + os.arch() + '/clang-format' +
               ((os.platform() === 'win32') ? '.exe' : '');
    }

    if (!fs.existsSync(binary))
      throw new Error("Doesn't bundle the clang-format executable for your platform(" +
                      os.platform() + "_" + os.arch() +
                      "). Consider installing it with your native package manager instead.");

    var command = `${binary}`;
    var options = {stdio: ['pipe', 'pipe', 'ignore'], input: editor.getText()};
    var args = {
      'style': JSON.stringify(atom.config.get('atom-format.style')),
      'assume-filename': editor.getPath(),
    };
    for (var k in args)
      command += ` -${k}=${args[k]}`;
    editor.getBuffer().setTextViaDiff(execSync(command, options).toString());
  }
}
