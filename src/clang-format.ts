import {execSync} from 'child_process';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import {CompositeDisposable, NotificationManager} from 'atom';

export class ClangFormat {
  private subscriptions = new CompositeDisposable();

  constructor() {
    this.subscriptions.add(atom.commands.add('atom-workspace', 'atom-format:format', () => {
      var editor = atom.workspace.getActiveTextEditor();
      editor && this._format(editor.getPath());
    }));
  }
  public destroy() {
    this.subscriptions.dispose();
  }

  private _format(filepath) {
    var binary = atom.config.get('atom-format.executable');
    if (!binary) {
      binary = './bin/' + os.platform() + "_" + os.arch() + '/clang-format' +
               ((os.platform() === 'win32') ? '.exe' : '');
    }

    if (!fs.existsSync(binary))
      throw new Error("Doesn't bundle the clang-format executable for your platform(" +
                      os.platform() + "_" + os.arch() +
                      "). Consider installing it with your native package manager instead.");

    var args = JSON.stringify(atom.config.get('atom-format.style'));
    return execSync(`${binary} -i -style=${args} ${filepath}`,
                    {stdio: ['ignore', 'pipe', process.stderr]});
  }
}
