import {spawn} from 'child_process';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

export class ClangFormat {
  constructor() {
    console.log('constructor...');
    atom.workspace.observeTextEditors((editor) => {
      editor.getBuffer().onWillSave(() => {
        this._format(editor.getPath());
      });
    });
  }
  public destroy() {
    console.log('destroy...');
  }

  private _format(filepath) {
    var binary = atom.config.get('atom-format.executable');
    if (!binary) {
      binary = './bin/' + os.platform() + "_" + os.arch() + '/clang-format' +
               ((os.platform() === 'win32') ? '.exe' : '');
    }
    console.log(path.resolve(binary));

    if (!fs.existsSync(binary))
      throw new Error("Doesn't bundle the clang-format executable for your platform(" +
                      os.platform() + "_" + os.arch() +
                      "). Consider installing it with your native package manager instead. " +
                      binary);

    var args = JSON.stringify(atom.config.get('atom-format.style'));
    return spawn(binary, ['-i', '-style=' + args, filepath],
                 {stdio: ['ignore', 'pipe', process.stderr]});
  }
}
