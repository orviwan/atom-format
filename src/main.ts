import {ClangFormat} from './clang-format';

var settings = {
  config: {
    executable: {type: 'string', default: ''},
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
