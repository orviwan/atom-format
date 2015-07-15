var _this = this;
var clang_format_1 = require('./clang-format');
var settings = {
    config: {
        executable: { type: 'string', default: '' },
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
module.exports = settings;
