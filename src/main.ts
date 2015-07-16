import {ClangFormat} from './clang-format';
import * as os from 'os';
import * as fs from 'fs';

var binary =
    `${atom.config['configDirPath']}/packages/atom-format/bin/${os.platform()}_${os.arch()}/clang-format${os.platform()==='win32'?'.exe':''}`;
if (!fs.existsSync(binary))
  atom.notifications.addError(
      `Doesn't bundle the clang-format executable for your platform(${os.platform()}_${os.arch()}). Consider installing it with your native package manager instead.`);

var settings = {
  config: {
    executable: {type: 'string', default: binary},
    style: {type: 'string', default: 'file'},
    autoSave:
        {type: 'array', default: ['.ts', '.js', '.c++', '.cpp', '.c', '.h', 'objc', 'objcpp']}
  },
  activate: () => {
    this.format = new ClangFormat();
  },
  deactivate: () => {
    this.format.destroy();
  }
};
export = settings;
