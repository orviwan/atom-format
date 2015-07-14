import {ClangFormat} from './clang-format';

var settings = {
  config:
      {executable: {type: 'string', default: undefined}, style: {type: 'string', default: 'file'}},
  activate: () => {
    this.format = new ClangFormat();
  },
  deactivate: () => {
    this.format.destroy();
  }
};
