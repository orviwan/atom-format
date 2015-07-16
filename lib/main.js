var _this = this;
var clang_format_1 = require('./clang-format');
var os = require('os');
var fs = require('fs');
var binary = './bin/' + os.platform() + "_" + os.arch() + '/clang-format' +
    ((os.platform() === 'win32') ? '.exe' : '');
if (!fs.existsSync(binary))
    atom.notifications.addError("Doesn't bundle the clang-format executable for your platform(" + os.platform() + "_" + os.arch() + "). Consider installing it with your native package manager instead.");
module.exports = {
    config: {
        executable: { type: 'string', default: binary },
        style: { type: 'string', default: 'file' },
        autoSave: { type: 'array', default: ['.ts', '.js', '.c++', '.cpp', '.c', '.h', 'objc', 'objcpp'] }
    },
    activate: function () {
        _this.format = new clang_format_1.ClangFormat();
    },
    deactivate: function () {
        _this.format.destroy();
    }
};
