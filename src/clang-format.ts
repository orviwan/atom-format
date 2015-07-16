import * as fs from 'fs';
import {execSync} from 'child_process';
import {CompositeDisposable} from 'atom';

export class ClangFormat {
  private subscriptions = new CompositeDisposable();
  private enableAutoFormat = true;
  constructor() {
    this.subscriptions.add(atom.commands.add('atom-workspace', 'atom-format:format', () => {
      var editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        this._format(editor);
        atom.notifications.addSuccess('Format successfully.');
      }
    }));
    this.subscriptions.add(
        atom.commands.add('atom-workspace', 'atom-format:autoFormatOnSave', () => {
          this.enableAutoFormat = !this.enableAutoFormat;
          atom.notifications.addInfo(`${this.enableAutoFormat?'Enable':'Disable'} auto format.`);
        }));
    this.subscriptions.add(atom.workspace.observeTextEditors((editor) => {
      var onSave = editor.getBuffer().onWillSave(() => {
        var autoSave = atom.config.get('atom-format.autoSave');
        var extension = (editor.getPath().match(/\..+?$/) || [])[0];
        if (this.enableAutoFormat && autoSave.indexOf(extension) >= 0) {
          this._format(editor);
          atom.notifications.addSuccess('Auto format on save successfully.');
        }
      });
      var onDestroy = editor.getBuffer().onDidDestroy(() => {
        onSave.dispose();
        onDestroy.dispose();
        this.subscriptions.remove(onDestroy);
        this.subscriptions.remove(onSave);
      });
      this.subscriptions.add(onSave);
      this.subscriptions.add(onDestroy);
    }));
  }
  public destroy() {
    this.subscriptions.dispose();
  }

  private _format(editor) {
    var command = `${atom.config.get('atom-format.executable')}`;
    if (!fs.existsSync(command)) {
      atom.notifications.addError(
          `Doesn't bundle the clang-format executable by your setting path(${command}). Consider setting it with your correct path instead.`);
      return;
    }

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
